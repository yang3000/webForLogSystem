/**
 * Created by 21515483 on 2016/8/31.
 */
var userManagement = require('../routes/userManagement');
var userGroup = require('../routes/userGroup');
var projectManagement = require('../routes/projectManagement');
var projectShow = require('../routes/projectShow');
module.exports = function(app){
    userManagement.init(app);
    userGroup.init(app);
    projectManagement.init(app);
    projectShow.init(app);
};