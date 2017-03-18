/**
 * Created by yhorz on 2016/7/17.
 */
var mysql = require('mysql');
var $conf = require('../MySql/config');
var $util = require('../MySql/util');
var $sql = require('./sqlMapping');

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

module.exports = {
    add: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;

            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.insert, [param.name, param.age], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'增加成功'
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var id = +req.query.id;
            connection.query($sql.delete, id, function(err, result) {
                if(result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg:'删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        if(param.name == null || param.age == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
                // 使用页面进行跳转提示
                if(result.affectedRows > 0) {
                    res.render('suc', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('fail',  {
                        result: result
                    });
                }
                console.log(result);

                connection.release();
            });
        });

    },
    queryById: function (req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryById, id, function(err, result) {

                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
    ,
    querySn: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            var data =null;
            connection.query($sql.querySn, function(err, result) {
                data = result;
                for(var i=0;i<data.length;i++){
                    var sn = data[i].sn;
                    var sql = "SELECT * FROM mydata.fa_prefinal where sn = '" + sn+"'";
                    connection.query(sql , function(err, result1) {
                        var dsd = result1;
                        var dd=dsd;
                        //connection.release();
                    });
                }
               // jsonWrite(res, data);
                connection.release();
            });

        });
    }
    ,
    queryStation: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryStation, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
    ,
    queryBarDataByDate: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryBarDataByTime,[param.testItem], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });

        });
    },
    queryDetailByCSN: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryTableName, function(err, result) {
               // jsonWrite(res, result);
                var items = result;
                connection.query($sql.queryDetailByCSN,[param.csn], function(err, result) {
                  //  jsonWrite(res, result);
                    if(typeof result === 'undefined') {
                        res.json({
                            code:'1',
                            msg: '操作失败'
                        });
                    } else {
                        res.json({
                            code:'0',
                            items:items,
                            data: result
                        });
                    }
                    connection.release();
                 });
            });

        });
    },
    queryFirstYeild_SA_MTF: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryFirstYeild_SA_MTF, function(err, result) {
                    //  jsonWrite(res, result);
                    if(typeof result === 'undefined') {
                        res.json({
                            code:'1',
                            msg : '操作失败'
                        });
                    } else {
                        res.json({
                            code :'0',
                            data : result
                        });
                    }
                    connection.release();
            });
        });
    }
};
