/**
 * Created by yhorz on 2016/8/7.
 */
var sqlite_db = require('./sqlite');
module.exports = {
    insertOperationLog: function (req) {
        var param = req.body;
        var ip = req._remoteAddress;
        ip = ip.substr(7,ip.length-7);
        var sql="insert into operationLog (userName,userComputerName,userIp,operationCode) " +
            "values ('"+req.session.userNameEn+"','unknown','"+ip+"','"+param.log+"')";
        sqlite_db.serialize(function () {
            sqlite_db.run(sql, function (err) {
                if (err) {
                    return 0;
                } else {
                    console.log(sql);
                    return 1;
                }
            });
        });
    },
    queryUserList: function (req,res) {
        var param = req.body;
        var sql =   "select name_cn,name_en,id from user where department =? order by id ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql,[param.department], function (err,rows) {
                 if (err) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                }else{
                    var userTree = {data : rows, count:rows.length};
                    var html_data="";
                    for(var i = 0 ; i<userTree.count ; i++){
                        html_data +="   <div class=\"control-group\">\n";
                        html_data +="       <label class=\"checkbox\">\n";
                        html_data +="           <div class=\"checker\">\n";
                        html_data +="               <span><input type=\"checkbox\" value=\""+userTree.data[i].name_en+"\" name=\"checkbox\"/></span>\n";
                        html_data +="           </div> "+userTree.data[i].name_cn;
                        html_data +="       </label> \n";
                        html_data +="   </div>\n";
                    }
                    res.json({
                        code: '0',
                        data: html_data
                    });
                }
            });
        });
    }
};
