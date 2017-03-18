/**
 * Created by 21515483 on 2017/3/9.
 */
var async = require("async");
var mysql = require("../MySql/Mysql");

var getNewSqlParamEntity =mysql.getNewSqlParamEntity;

var sqlParamsEntity = [];
var sql1 = "insert into  test ( id,name)  values (?,?)";
var param1 = [6,'44444444'];
sqlParamsEntity.push(getNewSqlParamEntity(sql1, param1));
var sql2 = "insert into test ( id,name)  values (?,?)";
var param2 = [6,'5555555555'];
sqlParamsEntity.push(getNewSqlParamEntity(sql2, param2));

var execTrans = mysql.execTrans;

// execTrans(sqlParamsEntity, function(err, info){
//     if(err){
//         console.error("事务执行失败:"+err);
//     }else{
//         console.log(info);
//     }
// });
mysql.execSql("select * from usergroup",[],function (err,result) {
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
    console.log("success");
});

/*connection.getConnection(function(err, connection)  {
    connection.query('select * from test', [], function(err, result) {
        if(result) {}
        connection.release();
    });
});*/
var task1 =function(callback){

    console.log("11111");
    callback(null,"4343")
}

var task2 =function(result,callback){
    console.log("上面给的结果："+result);
    console.log("22222");
    callback(null,"234")
}

var task3 =function(result,callback){
    console.log("上面给的结果："+result);
    console.log("33333");
    callback(null,"345")
}


module.exports = {
    test:function () {
        async.waterfall([task1,task2,task3],function(err,result){

            console.log("series");

            if (err) {
                console.log(err);
            }

            console.log(result);
        })
    }
}