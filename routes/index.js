var userDao = require('../Dao/testDao');
module.exports = function(app){

  app.post('/get_FirstYeild_SA_MTF',function(req,res, next){
    userDao.queryFirstYeild_SA_MTF(req, res, next);
  });
};
