/**
 * Created by 21515483 on 2016/9/8.
 */
/**
 * Created by yhorz on 2016/8/29.
 */
var $sql    = require('./sqlMapping');
var sqlite_db   = require('./sqlite');
var crypto    = require('crypto');
var soap = require('soap');
var mysql = require("../MySql/Mysql");

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
    queryUserInfo: function (req, res ) {
        var param = req.body;
        var page = 0;
        var sql  =  "SELECT (select count(1) from user b where a.id>=b.id ) as rownum,a.id,a.name,a.userName,c.groupName "+
                    "FROM user a "+
                    "left join  userGroup c on a.roleId=c.roleId ";
        sql+=" order by a.id ";
        if(param.page!=undefined){
            page =  param.page > 0 ? param.page-1 : 0;
            sql+=" limit "+page*10+",10 ";
        }else{
            sql+=" limit 0,10 ";
        }

        mysql.execSql(sql,[],function (err,rows) {
            if(err){
                    res.json({
                        code:'1',
                        msg: '操作失败',
                        msgFromNode:err.message
                    });
            }
            else{
                module.exports.queryPageCount("2",function(msg) {
                    if(msg.code==1){
                        res.json({
                            code:'1',
                            msg: '操作失败'
                        });
                    }
                    else{
                        if(param.page==undefined){
                            res.render('userManagement/userManagement',{data: rows,page_count:msg.pageSize,page_data:"ewewtreytryur"});
                        }else{
                            res.json({
                                data:rows,
                                page_count:msg.pageSize
                            });
                        }
                    }
                });
            }
            console.log("success");
        });

       /* sqlite_db.serialize(function() {
            sqlite_db.all(sql, function(err, rows) {
                if (err) {
                        res.json({
                            code:'1',
                            msg: '操作失败',
                            msgFromNode:err.message
                        });
                } else {
                    module.exports.queryPageCount("2",function(msg) {
                        if(msg.code==1){
                            res.json({
                                code:'1',
                                msg: '操作失败'
                            });
                        }
                        else{
                            if(param.page==undefined){
                                res.render('userManagement/userManagement',{data: rows,page_count:msg.pageSize,page_data:"ewewtreytryur"});
                            }else{
                                res.json({
                                    data:rows,
                                    page_count:msg.pageSize
                                });
                            }
                        }
                    });
                }
            });
        });*/
       // sqlite_db.close();
    },
    queryPageCount: function (param,fun){
        var sql="select  case when count(1)%10 =0 then count(1)/10  else round(COUNT(1) / 10) + 1 end as count from user ";
        mysql.execSql(sql,[],function (err,rows) {
            if (err) {
                fun({code:1,pageSize:0});
            } else {
                fun({code:0,pageSize:rows[0].count});
            }
        });
    },
    deleteUserInfo: function (req, res, next ) {
        var param = req.body;
        var sql = "delete  from user where id=? ";
        var param = [param.index];
        var sqlParamsEntity = [];
        sqlParamsEntity.push(mysql.getNewSqlParamEntity(sql, param));
        mysql.execTrans(sqlParamsEntity, function(err, info){
            if (err) {
                res.json({
                    code: '1',
                    msg: '操作失败'
                });
            } else {
                res.json({
                    code: '0',
                    msg: '操作成功'
                });
            }
        });
    },
    editUserInfo: function (req, res, next) {
        var param = req.body;
        var sql = "select * from user where id=? ";
        mysql.execSql(sql,[param.index],function (err,rows) {
            if (err) {
                res.json({
                    code: '1',
                    msg: '操作失败'
                });
            }else {
                res.json({
                    code: '0',
                    data:rows[0]
                });
            }
        });
    },
    saveUserInfo: function (req, res, next ) {

        var param = req.body;
        var sql = "";
        var paramList=[];
        var password_md5 ;
        if(param.password!="" && param.password!=null){
            var md5 = crypto.createHash('md5');
            md5.update(param.password);
            password_md5 = md5.digest('hex');
        }else{
            res.json({
                code: '1',
                msg: 'Password is Null!'
            });
            return;
        }
        if(param.userName=="" || param.userName==null){
            res.json({
                code: '1',
                msg: 'Username is Null!'
            });
            return;
        }


        if(param.edit_save == 1){//更新操作
            sql ="update user set name = ? , userName = ?  , roleId = ? where id = ? ";
            paramList=[
                param.name,
                param.userName,
                password_md5,
                param.roleId,
                param.id_user
            ];
        }else{//插入操作
            sql = "insert into user (name,userName,password,roleId,status) values (?,?,?,?,?) ";
            paramList=[
                param.name,
                param.userName,
                password_md5,
                param.roleId,
                '1'
            ];
        }



        mysql.getConnection(function (connection) {
            var funcArray=[];
            var checkUser = function (cb) {
                var sql = "select count(1) as count from  user where userName ='" +param.userName+"'";
                connection.query(sql,[], function (err, rows, fields) {
                    if (err) {
                        cb(err);
                    }else {
                        if((param.edit_save!=1) && (rows[0].count > 0 ))
                            cb(new Error("User already exists"));
                        else
                            cb(null,"OK");
                    }
                });
            }
            var updateUserInfo = function (result,cb) {
                connection.query(sql, paramList, function (err, rows, fields) {
                    if (err) {
                        cb(err);
                    }else {
                        cb(null,"OK");
                    }
                });
            }
            funcArray.push(checkUser);
            funcArray.push(updateUserInfo);
            mysql.execWaterFall(funcArray,connection,function (error,info) {
                if (error) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                }else {
                    res.json({
                        code: '0',
                        msg: '操作成功'
                    });
                }
            })
        })
    },


    queryRole: function (req, res, next ) {
        var sql = "select a.groupName as name,a.roleId as code from userGroup a group by a.roleId";
        mysql.execSql(sql,[],function (err,rows) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                } else {
                    res.json({
                        code: '0',
                        data: rows
                    });
                }
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
