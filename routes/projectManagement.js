/**
 * Created by 21515483 on 2016/8/31.
 */
var projectManagementDao = require('../Dao/projectManagement_Dao');
module.exports = {
    init : function(app) {
        app.get('/projectManagement', function (req, res) {
            projectManagementDao.queryProjectInfo(req, res);
        });
        app.post('/query_projectInfo',function(req,res, next){
            projectManagementDao.queryProjectInfo(req, res, next);
        });
        app.post('/save_projectInfo',function(req,res, next){
            projectManagementDao.saveProjectInfo(req, res, next);
        });
        app.post('/edit_projectInfo',function(req,res, next){
            projectManagementDao.editProjectInfo(req, res, next);
        });
        app.post('/delete_projectInfo',function(req,res, next){
            projectManagementDao.deleteProjectInfo(req, res, next);
        });
    }
};