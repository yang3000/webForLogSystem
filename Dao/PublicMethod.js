/**
 * Created by yhorz on 2016/8/7.
 */
/**
 * Created by yhorz on 2016/7/17.
 */
var mysql = require('mysql');
var $conf = require('../public/javascripts/MySql/config');
var $util = require('../public/javascripts/MySql/util');
var $sql = require('./sqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    queryDetailByCSN: function (req, res, next) {
        var param = req.body;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryTableName, function(err, result) {
                // jsonWrite(res, result);
                var items = result;
                connection.query($sql.queryDetailByCSN,[param.csn], function(err, result) {
                    //  jsonWrite(res, result);
                    if(typeof result === 'undefined') {
                        res.json({
                            code:'1',
                            msg: '操作失败'
                        });
                    } else {
                        res.json({
                            items:items,
                            data: result
                        });
                    }
                    connection.release();
                });
            });

        });
    }
};
