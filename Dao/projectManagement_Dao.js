/**
 * Created by 21515483 on 2016/9/8.
 */
/**
 * Created by yhorz on 2016/8/29.
 */
var $sql    = require('./sqlMapping');
var sqlite_db   = require('./sqlite');
var menuTree = null;
var html_data = "";
module.exports = {
    queryProjectInfo: function (req, res ) {
        var param = req.body;
        var page = 0;
        var sql ="select (select count(1) from project b where a.id>=b.id ) as rownum, a.projectName,c.name,a.creator,a.projectCode,a.createTime,a.id " +
            " from project a left join department c on a.department = c.code  group by a.id ";
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
                                 res.render('projectManagement/projectManagement',{data: rows,page_count:msg.pageSize});
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
        var sql="select  case when count(1)%10 ==0 then count(1)/10  else count(1)/10+1 end as count from project ";
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
    deleteProjectInfo: function (req, res, next ) {
        var param = req.body;
        var sql = "delete from projectOwner where projectCode = ? ";
        sqlite_db.serialize(function () {
            sqlite_db.run(sql, [param.index],
                function (err) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: '操作失败'
                        });
                    } else {
                        sql="delete  from project where projectCode=? ";
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
    editProjectInfo: function (req, res, next) {
        var param = req.body;
        var sql = "select projectName,projectCode,department from project where projectCode=? ";
        sqlite_db.serialize(function () {
            sqlite_db.all(sql, [param.index], function(err,rows) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: err
                    });
                }else{
                    if (rows.length <= 0) {
                        res.json({
                            code: '1',
                            msg: '未找到数据'
                        });
                    }
                    var user_sql="select id,owner from projectOwner where projectCode= ? ";
                    var data_project = rows;
                    sqlite_db.all(user_sql, [data_project[0].projectCode], function(err,rows) {
                        if (err)
                        {
                            res.json({
                                code: '1',
                                msg: '操作失败'
                            });
                        }else{
                            res.json({
                                code: '0',
                                data:{
                                    projectName:data_project[0].projectName,
                                    department:data_project[0].department,
                                    userIdList:rows
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    saveProjectInfo: function (req, res, next) {
        var param = req.body;
        var sql = "";
        var paramList=[];
        if(param.edit_save == 1){//更新操作
            sql ="update project set projectName = ?, department = ? where projectCode = ? ";
            paramList=[
                param.projectName,
                param.department,
                param.projectId
            ];
        }else{//插入操作
            sql = "insert into project (projectName,department,creator,projectCode) values (?,?,?,(SELECT max(projectCode) FROM project)+1) ";
            paramList=[
                param.projectName,
                param.department,
                req.session.userNameEn
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
                        var role_sql="delete from projectOwner where projectCode = ? ";
                        var stmt_delete = sqlite_db.prepare(role_sql);
                        stmt_delete.run(param.projectId);
                        stmt_delete.finalize();

                        //更新role表新的数据
                        role_sql="insert into projectOwner ( projectCode,owner,permissionCode ) values ("+(param.edit_save == 1 ? param.projectId : "(SELECT max(projectCode) FROM project )")+",?,?)";
                        var userIds = JSON.parse(param.userIds);
                        if(userIds.length<=0){
                            sqlite_db.run("ROLLBACK");
                            res.json({
                                code: '1',
                                msg: 'Please choose user!'
                            });
                            return;
                        }
                        var stmt = sqlite_db.prepare(role_sql);
                        for(var i=0;i<userIds.length;i++){
                            stmt.run(userIds[i],'1');
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
    }
};
