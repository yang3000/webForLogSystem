/**
 * Created by 21515483 on 2016/10/31.
 */
var public   = require('../Dao/public');
module.exports = {
    main: function (req, res, next) {
        console.log("url:"+req.originalUrl);
        var url =req.originalUrl;
        if(url != "/login" && url != "/dologin" && !req.session.isOnLine){
            res.redirect('login');
            return;
        }
        if(
            ("dologin" == url.match("dologin")) ||
            ("save" == url.match("save"))       ||
            ("delete" == url.match("delete"))
        ){
            public.insertOperationLog(req);
        }
        next();
    }
}