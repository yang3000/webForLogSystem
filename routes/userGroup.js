/**
 * Created by 21515483 on 2016/8/31.
 */
var userGroupDao = require('../Dao/userGroup_Dao');
var loginDao = require('../Dao/login');
module.exports = {
    init : function(app) {
        app.get('/userGroup', function (req, res) {
            userGroupDao.queryUserGroupInfo(req, res);
        });
        app.post('/query_userGroupInfo',function(req,res, next){
            userGroupDao.queryUserGroupInfo(req, res, next);
        });
        app.post('/query_menuTree',function(req,res, next){
            userGroupDao.queryMenuTree(req, res, next);
        });
        app.post('/save_userGroupInfo',function(req,res, next){
            userGroupDao.saveUserGroupInfo(req, res, next);
        });
        app.post('/edit_userGroupInfo',function(req,res, next){
            userGroupDao.editUserGroupInfo(req, res, next);
        });
        app.post('/delete_userGroupInfo',function(req,res, next){
            userGroupDao.deleteUserGroupInfo(req, res, next);
        });
    }
};