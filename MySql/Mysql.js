/**
 * Created by 21515483 on 2017/3/9.
 */
var mysql = require('mysql');
var async = require("async");
var $conf = require('../MySql/config');
var $util = require('../MySql/util');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};
function getNewSqlParamEntity(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
};
function execSql(sql,params,callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err, null);
        }
        connection.query(sql,params, function (tErr, rows, fields) {
            connection.release();
            if (tErr) {
                return callback(tErr, null);
            } else {
                return callback(null, rows);
            }
        })
    });
}
function execTrans(sqlParamsEntities, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行事务，共执行" + sqlParamsEntities.length + "条数据");

            var funcAry = [];
            sqlParamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                return cb(tErr, "SQL执行FAIL,"+JSON.stringify(sql_param) +","+tErr);
                            });
                        } else {
                            return cb(null, 'SQL执行OK');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                console.log("Result：" + JSON.stringify(result));
                if (err) {
                    connection.rollback(function (err_rollback) {
                        if(err_rollback){
                            console.log("数据回滚失败: " + err_rollback);
                            return callback(err_rollback, null);
                        }
                        else {
                            return callback(err, null);
                        }
                        connection.release();

                    });
                } else {
                    connection.commit(function (err, info) {
                        if (err) {
                            connection.rollback(function (err_rollback) {
                                if(err_rollback){
                                    return callback(err_rollback, null);
                                }else{
                                    return callback(err, null);
                                }
                                connection.release();
                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
}
function getConnection(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err, null);
        }
        else
            return callback(connection);
    });
}
function execWaterFall(funcArray,connection,callback) {
    console.log("开始执行事务，共执行" + funcArray.length + "条数据");
    connection.beginTransaction(function (err) {
        if (err) {
            return callback(err, null);
        }
        async.waterfall(funcArray, function (err, result) {
            console.log("Result：" + JSON.stringify(result));
            if (err) {
                connection.rollback(function (err_rollback) {
                    connection.release();
                    if(err_rollback){
                        console.log("数据回滚失败: " + err_rollback);
                        return callback(err_rollback, null);
                    }
                    else {
                        return callback(err, null);
                    }
                });
            } else {
                connection.commit(function (err, info) {
                    if (err) {
                        connection.rollback(function (err_rollback) {
                            connection.release();
                            if(err_rollback){
                                return callback(err_rollback, null);
                            }else{
                                return callback(err, null);
                            }

                        });
                    } else {
                        connection.release();
                        return callback(null, info);
                    }
                })
            }
        })
    });
}
function execTransByFunctionArrays(funcArray, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行事务，共执行" + funcArray.length + "条数据");
            async.waterfall(funcArray, function (err, result) {
                console.log("Result：" + JSON.stringify(result));
                if (err) {
                    connection.rollback(function (err_rollback) {
                        connection.release();
                        if(err_rollback){
                            console.log("数据回滚失败: " + err_rollback);
                            return callback(err_rollback, null);
                        }
                        else {
                            return callback(err, null);
                        }
                    });
                } else {
                    connection.commit(function (err, info) {
                        if (err) {
                            connection.rollback(function (err_rollback) {
                                connection.release();
                                if(err_rollback){
                                    return callback(err_rollback, null);
                                }else{
                                    return callback(err, null);
                                }

                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
}
module.exports = {
    getNewSqlParamEntity : getNewSqlParamEntity,
    jsonWrite : jsonWrite,
    execTrans : execTrans,
    execSql   :execSql,
    execTransByFunctionArrays : execTransByFunctionArrays,
    getConnection : getConnection,
    execWaterFall : execWaterFall,
    pool      :pool
};



/*//创建一个connection
var connection = mysql.createConnection({
    host     : '192.168.0.200',       //主机
    user     : 'root',               //MySQL认证用户名
    password : 'abcd',        //MySQL认证用户密码
    port: '3306',                   //端口号
});
//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});


module.exports = connection;
//执行SQL语句
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) {
        console.log('[query] - :'+err);
        return;
    }
    console.log('The solution is: ', rows[0].solution);
});
//关闭connection
connection.end(function(err){
    if(err){
        return;
    }
    console.log('[connection end] succeed!');
});*/
