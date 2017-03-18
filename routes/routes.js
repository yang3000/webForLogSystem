/**
 * Created by yhorz on 2016/7/17.
 */
module.exports = function(app){
    app.get('/',function(req,res){
        res.render('login');
    });
    app.get('/test',function(req,res){
        res.sendfile('./views/BarByTest_3.0.0.html');
    });
    app.get('/login',function(req,res){
      // res.render('index', { title: 'Express' });
        //res.render('mainpage/userManagement', { title: 'Express' });
        //res.send("sdfsdf");
       // res.sendfile('./views/MainPage.html');
         res.render('login');
    });
    app.get('/detail',function(req,res){
        res.render('detail');
        // res.sendfile('./views/MainPage.html');
    });
    app.get('/iac',function(req,res){
        res.sendfile('./views/index.html');
    });

};