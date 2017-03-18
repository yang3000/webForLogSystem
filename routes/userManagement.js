/**
 * Created by 21515483 on 2016/8/31.
 */
var userManagementDao = require('../Dao/userManagement_Dao');
var loginDao = require('../Dao/login');
module.exports = {
    init : function(app) {
        app.get('/userManagement', function(req,res){
            userManagementDao.queryUserInfo(req, res);
        });
        app.post('/query_userInfo',function(req,res, next){
            userManagementDao.queryUserInfo(req, res, next);
        });
        app.post('/query_jobTitle', function(req,res,next){
            userManagementDao.queryJobTitle(req, res,next);
        });
        app.post('/delete_userInfo',function(req,res, next){
            userManagementDao.deleteUserInfo(req, res, next);
        });
        app.post('/eidt_userInfo',function(req,res, next){
            userManagementDao.editUserInfo(req, res, next);
        });
    }
};