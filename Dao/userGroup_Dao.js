/**
 * Created by 21515483 on 2016/9/8.
 */
/**
 * Created by yhorz on 2016/8/29.
 */
var $sql    = require('./sqlMapping');
var sqlite_db   = require('./sqlite');
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};
var menuTree = null;
var html_data = "";
module.exports = {
    queryUserGroupInfo: function (req, res ) {
        var param = req.body;
        var page = 0;
        var sql ="select (select count(1) from userGroup b where a.groupId>=b.groupId ) as rownum, a.groupName,a.creator,a.createTime,a.remark,a.id " +
            " from userGroup a group by groupId ";
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
                         }
                         else{
                             if(param.page==undefined){
                                 res.render('userManagement/userGroup',{data: rows,page_count:msg.pageSize,page_data:"ewewtreytryur"});
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
       // sqlite_db.close();
    },
    queryPageCount: function (fun){
        var sql="select  case when count(1)%10 ==0 then count(1)/10  else count(1)/10+1 end as count from userGroup ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql,function(err, rows) {
                if (err) {
                    fun({code:1,pageSize:0});
                } else {
                    fun({code:0,pageSize:rows[0].count});
                }
            });
        });
    },
    deleteUserGroupInfo: function (req, res, next ) {
        var param = req.body;
        var sql = "delete from role where groupId = (select groupId from userGroup where id = ?)";
        sqlite_db.serialize(function () {
            sqlite_db.run(sql, [param.index],
                function (err) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: '操作失败'
                        });
                    } else {
                        sql="delete  from userGroup where id=? ";
                        sqlite_db.run(sql,[param.index],function (err) {
                            if(err){
                                res.json({
                                    code: '1',
                                    msg: '操作失败'
                                });
                            }else{
                                res.json({
                                    code: '0',
                                    msg: '操作成功'
                                });
                            }
                        })

                    }
                });
        });
    },
    editUserGroupInfo: function (req, res, next) {
        var param = req.body;
        var sql = "select groupName,remark,groupId from userGroup where id=? ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql, [param.index], function(err,rows) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                }
                else {
                    var role_sql="select groupId,menuNode from role where groupId=? ";
                    var data_userGroup = rows;
                    sqlite_db.all(role_sql, [data_userGroup[0].groupId], function(err,rows) {
                        if (err)
                        {
                            res.json({
                                code: '1',
                                msg: '操作失败'
                            });
                        }
                        else
                        {
                            res.json({
                                code: '0',
                                data:{
                                    groupName:data_userGroup[0].groupName,
                                    remark:data_userGroup[0].remark,
                                    menuIdList:rows
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    saveUserGroupInfo: function (req, res, next) {
        var param = req.body;
        var sql = "";
        var paramList=[];
        if(param.edit_save == 1){//更新操作
            sql ="update userGroup set groupName = ? , creator = ?  , remark = ? where id = ? ";
            paramList=[
                param.groupName,
                req.session.userNameEn,
                param.remark,
                param.groupId
            ];
        }else{//插入操作
            sql = "insert into userGroup " +
            "(groupName,groupId,creator,remark) " +
            "values (?,(SELECT max(groupId) FROM userGroup)+1,?,?) ";
            paramList=[
                param.groupName,
                req.session.userNameEn,
                param.remark
            ];
        }

        sqlite_db.serialize(function () {
            sqlite_db.run("BEGIN");
            sqlite_db.run(sql, paramList,
                function (err) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: '操作失败'
                        });
                    } else {
                        //先删除role表数据
                        var role_sql="delete from role where groupId = ? ";
                        var stmt_delete = sqlite_db.prepare(role_sql);
                        stmt_delete.run(param.groupId);
                        stmt_delete.finalize();

                        //更新role表新的数据
                        role_sql="insert into role (groupId,menuNode) values ("+(param.edit_save == 1 ? param.groupId : "(SELECT max(groupId) FROM userGroup)")+",?)";
                        var menuIds = JSON.parse(param.menuIds);
                        if(menuIds.length<=0){
                            sqlite_db.run("ROLLBACK");
                            res.json({
                                code: '1',
                                msg: 'Please choose menus!'
                            });
                            return;
                        }
                        var stmt = sqlite_db.prepare(role_sql);
                        for(var i=0;i<menuIds.length;i++){
                                stmt.run(menuIds[i]);
                        }
                        stmt.finalize();
                        sqlite_db.run("COMMIT");
                        res.json({
                            code: '0',
                            msg: '操作失败'
                        });
                    }
                });
        });
    },
    queryDepartment: function (req, res, next ) {
        var param = req.body;
        var sql = "select * from department ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql, function (err,rows) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: '操作失败'
                        });
                    } else {
                        res.json({
                            code: '0',
                            data: rows
                        });
                    }
            });
        });
    },
    queryMenuTree: function (req, res, next ) {
        var param = req.body;
        var sql =   "select menuName,leafNode,node,parent " +
                    "from menu "+
                    "order by node ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql, function (err,rows) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: '操作失败'
                    });
                }
                else
                {
                    menuTree = {data : rows, count:rows.length};
                    html_data="";
                    module.exports.queryLeafNode(0);
                    res.json({
                        code: '0',
                        data: html_data
                    });
                }
            });
        });
    },
    queryLeafNode : function(deep){
        for(var i = 0 ; i<menuTree.count ; i++){
            if(menuTree.data[i].parent == deep){
                if(menuTree.data[i].leafNode == "true" && deep > 0)
                    html_data += "<div class=\"check-div-child\">\n";
                html_data +="   <div class=\"control-group\">\n";
                html_data +="       <label class=\"checkbox\">\n";
                html_data +="           <div class=\"checker\">\n";
                html_data +="               <span><input type=\"checkbox\" value=\""+menuTree.data[i].node+"\" name=\"checkbox\"/></span>\n";
                html_data +="           </div> "+menuTree.data[i].menuName;
                html_data +="       </label> \n";
                module.exports.queryLeafNode(menuTree.data[i].node);
                html_data +="   </div>\n";
                if(menuTree.data[i].leafNode == "true")
                    html_data += "</div>\n";
            }
        }
    }
};
