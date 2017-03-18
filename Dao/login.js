/**
 * Created by 21515483 on 2016/9/18.
 */

var $sql    = require('./sqlMapping');
var sqlite_db   = require('./sqlite');
var crypto    = require('crypto');
var soap = require('soap');
module.exports = {
    verifyUserInfoFromSVN: function(user,password,func){
      //  var url ='http://10.160.194.36:8600/webapp.asmx?WSDL';
       // var args = {User:"admin",Password:"123243"};
      //  soap.createClient(url, function(err, client) {
       //     client.Login(args, function(err, result) {
        //        console.log(result.LoginResult);
                func(user,password);
         //   });
       // });
    },
    verifyUserInfoFromMyWeb: function(req,res,user,password_md5){
        var sql ="select id,name_cn,name_en,roleId from user where name_en='"+user+"' and password='"+password_md5+"'";
        sqlite_db.serialize(function() {
            sqlite_db.all(sql, function(err, rows)  {
                if (err) {
                    res.json({
                        status: '1',
                        msg   : 'UserName or password is not correct!'
                    });
                } else {
                    if(rows.length<=0){
                        res.json({
                            status: '1',
                            msg   : 'UserName or password is not correct!'
                        });
                    }else{
                        req.session.isOnLine=true;
                        req.session.userId=rows[0].id;
                        req.session.userNameCn=rows[0].name_cn;
                        req.session.userNameEn=rows[0].name_en;
                        req.session.userRoleId=rows[0].roleId;
                        req.session.ip = req._remoteAddress.substr(7,req._remoteAddress.length);
                        res.json({
                            status: '0',
                            msg   : 'UserName or password is correct!'
                        });
                    }
                }
            });
        });
    },
    //验证用户登录数据
    queryUserInfo: function (req, res ){
        var param = req.body;
         if(param.uname == "" || param.uname == undefined){
            res.json({status:'1', msg:'UserName is NULL'});
            return;
        }
        if(param.upwd == "" || param.upwd == undefined){
            res.json({status:'1',msg:'password is NULL'});
            return;
        }
        module.exports.verifyUserInfoFromSVN(param.uname,param.upwd,function (user,password) {
            var md5 = crypto.createHash('md5');
            md5.update(password);
            var password_md5 = md5.digest('hex');
            module.exports.verifyUserInfoFromMyWeb(req,res,user,password_md5);
        });
    },
    queryPageCount: function (param,fun){
        var sql="select  case when count(1)%10 ==0 then count(1)/10  else count(1)/10+1 end as count from user ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql,  [param.index],function(err, rows) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                } else {
                    fun(rows[0].count);
                }
            });
        });
    },
    deleteUserInfo: function (req, res, next ) {
        var param = req.body;
        var sql = "delete  from user where id=? ";
        sqlite_db.serialize(function () {
            sqlite_db.run(sql, [param.index],
                function (err) {
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
        });
    }
};
