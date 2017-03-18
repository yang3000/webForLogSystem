var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var routes = require('./routes/routes');
var ajax = require('./routes/ajax');
var aop = require('./AOP/main');
var async_test = require('./MySql/test');
async_test.test();
var publicRoutes = require('./routes/publicRoutes');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
        secret: '12345',
        name: 'testapp',   //this is cookie name，默认cookie的name是：connect.sid
        rolling: true,
        cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: true,
 }));
console.log("LOG:"+__dirname);
console.log("LOG:"+path);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function( req, res, next){
    aop.main(req, res, next);
});


routes(app);
ajax(app);
index(app);
publicRoutes(app);

app.use(express.static('three'));
app.use(express.static('echarts'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
app.listen(3000);