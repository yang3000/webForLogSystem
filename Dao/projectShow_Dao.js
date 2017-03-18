/**
 * Created by 21515483 on 2016/9/8.
 */
/**
 * Created by yhorz on 2016/8/29.
 */
var sqlite_db   = require('./sqlite');
module.exports = {
    queryProjectShowInfo: function (req, res ) {
        var param = req.body;
        var page = 0;
            var sql ="select a.* from view_userOperationLog a ";
        if(param.page!=undefined){
            page =  param.page > 0 ? param.page-1 : 0;
            sql+=" limit "+page*10+",10 ";
        }else{
            sql+=" limit 0,10 ";
        }
        sqlite_db.serialize(function() {
             sqlite_db.all(sql, function(err, rows) {
                 if (err) {
                     res.json({
                         code:'1',
                         msg: '操作失败',
                         msgFromNode:err.message
                     });
                 } else {
                     module.exports.queryPageCount(function(msg) {
                         if(msg.code==1){
                             res.json({
                                 code:'1',
                                 msg: '操作失败'
                             });
                         }else{
                             if(param.page==undefined){
                                 res.render('projectManagement/projectShow',{data: rows,page_count:msg.pageSize});
                             }else{
                                 res.json({
                                     data:rows,
                                     page_count:msg.pageSize
                                 });
                             }
                         }
                     });
                 }
            });
        });
    },
    queryPageCount: function (fun){
        var sql="select  case when count(1)%10 ==0 then count(1)/10  else count(1)/10+1 end as count from view_userOperationLog ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql,function(err, rows) {
                if (err) {
                    fun({code:1,pageSize:0});
                } else {
                    fun({code:0,pageSize:rows[0].count});
                }
            });
        });
    }
};
