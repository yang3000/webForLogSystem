/**
 * Created by yhorz on 2016/7/17.
 */
var userDao = require('../Dao/testDao');
var userManagementDao = require('../Dao/userManagement_Dao');
var loginDao = require('../Dao/login');
var mainDao = require('../Dao/mainDao');
var public   = require('../Dao/public');
module.exports = function(app){
    app.get('/ajax',function(req,res,next){
        userDao.queryStation(req, res, next);
    });
    app.post('/get_bar',function(req,res, next){

        userDao.queryBarDataByDate(req, res, next);
    });
    app.post('/get_detail',function(req,res, next){
        userDao.queryDetailByCSN(req, res, next);
    });
    app.post('/get_userName', function(req,res,next){
        res.json({ userName:req.session.userNameCn });
    });
    app.get('/mainPage',function(req,res){
        res.render('mainpage/mainpage');
    });
    app.post('/dologin', function(req,res){
        loginDao.queryUserInfo(req, res);
    });
    app.post('/query_menu_info', function(req,res){
        mainDao.queryMenuInfo(req, res);
    });
    app.post('/save_userInfo', function(req,res,next){
        userManagementDao.saveUserInfo(req, res,next);
    });
    app.post('/query_department', function(req,res,next){
        userManagementDao.queryDepartment(req, res,next);
    });
    app.post('/query_userList', function(req,res){
        public.queryUserList(req,res);
    });
    app.post('/query_role', function(req,res,next){
        userManagementDao.queryRole(req, res,next);
    });
};