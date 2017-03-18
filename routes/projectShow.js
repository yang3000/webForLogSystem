/**
 * Created by 21515483 on 2016/8/31.
 */
var projectShowDao = require('../Dao/projectShow_Dao');
module.exports = {
    init : function(app) {
        app.get('/projectShow', function (req, res) {
            projectShowDao.queryProjectShowInfo(req, res);
        });
        app.post('/query_projectLog',function(req,res, next){
            projectShowDao.queryProjectShowInfo(req, res, next);
        });
    }
};