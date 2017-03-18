/**
 * Created by yhorz on 2016/8/29.
 */
var fs = require('fs');
if (!fs.existsSync("databases"))
{
    fs.mkdirSync("databases", function (err)
    {
        if (err) {
            console.log(err);
            return;
        }
    });
}
//数据库接口库
var util = require('util');
var sqlite3 = require('sqlite3');
sqlite3.verbose();
var db = new sqlite3.Database("databases/chap06.sqlite3", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function(err){
            if (err){
                util.log('FAIL on creating database ' + err);
                callback(err);
            } else {
                console.log("success");
            }
        });
module.exports = db;