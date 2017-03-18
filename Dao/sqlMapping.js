/**
 * Created by yhorz on 2016/7/17.
 */
// CRUD SQL语句
var user = {
    insert:'INSERT INTO app_user(id, name, age) VALUES(0,?,?) ',
    update:'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    queryAll: 'select * from fa_prefinal',
    querySn:'SELECT distinct(sn) as sn FROM mydata.fa_prefinal',
    queryStation:'SELECT '+
                'STATION_ID ,DUT_POSITION,SRC_DATETIME, case when first_fail ="HRM_HDHG" then HRM_HDHG else "" end as value '+
                'FROM '+
                'mydata.laryon_assembly a '+
                'WHERE a.FIXTURE_ID = "Laryon Pre-Final Assembly" '+
                'AND a.SRC_DATETIME > "2016-07-01 11:00:00" '+
                'AND a.SRC_DATETIME < "2016-07-20 11:00:00" '+
                'and first_fail ="HRM_HDHG" '+
                'AND a.first_fail NOT IN ("DUT_Present","Verify_Comms") '+
                'and STATION_ID="LAY-ASS-25" '+
                'and a.sn not in (select IFNULL(b.sn,"") as sn  from mydata.laryon_assembly b where b.src_datetime <= "2016-07-01 11:00:00" ) ',
    queryBarDataByTime:'SELECT '+
                'substr(SRC_DATETIME,1,10) time,STATION_ID,DUT_POSITION,count(1) total '+
                'FROM '+
                'mydata.laryon_assembly '+
                'where FIRST_FAIL=? and substr(SRC_DATETIME,1,10)="2016-07-20" '+
                'GROUP BY station_id ,substr(SRC_DATETIME,1,10),DUT_POSITION '+
                'order by substr(SRC_DATETIME,1,10) desc,STATION_ID,DUT_POSITION ',
    queryTableName:'select COLUMN_NAME from information_schema.COLUMNS where table_name = "laryon_assembly" and table_schema = "mydata"',
    queryDetailByCSN:'SELECT  * FROM mydata.laryon_assembly where sn = ? order by src_datetime desc ',
    queryFirstYeild_SA_MTF:
        'SELECT DATE_FORMAT(start_time,"%Y-%m-%d") date,Station_ID, '+
        '   count(distinct PanelIDSN) total, '+
        '   count(distinct (case when DUT_Test_Result="Pass" then PanelIDSN else "#" end))-1 pass, '+
        '   round(100*(count(distinct (case when DUT_Test_Result="Pass" then PanelIDSN else "#" end))-1)/count(distinct PanelIDSN),2) first_yeild '+
        'FROM  mydata.laryonpanelmain '+
        'WHERE PanelIDSN LIKE "E150%" '+
        'AND PanelIDSN NOT in( '+
        '    SELECT ifnull(a.PanelIDSN,"") '+
        'FROM mydata.laryonpanelmain a '+
        'WHERE a.start_time < "2016-07-01" '+
        ')  ' +
        'AND start_time <curdate() '+
        'and start_time >DATE_SUB("2016-07-20",interval 6 day) '+
        'group by DATE_FORMAT(start_time,"%Y-%d-%m"),Station_ID ' +
        'having(ROUND(100 * (COUNT(DISTINCT (CASE WHEN DUT_Test_Result = "Pass" THEN PanelIDSN ELSE "#" END)) - 1) / COUNT(DISTINCT PanelIDSN),2)>60) '+
        'order by Station_ID,DATE_FORMAT(start_time,"%Y-%m-%d") ',
    queryUserInfo:
        'select 1 from user where username'
};

module.exports = user;