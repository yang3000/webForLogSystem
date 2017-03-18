/**
 * Created by 21515483 on 2016/9/8.
 */
var sqlite_db   = require('./sqlite');
module.exports = {
    html_menu :"",
    nodeList:[],
    queryMenuInfo: function (req, res ) {
        var roleId = req.session.userRoleId;
        var sql ='select b.menuName,b.url,b.node,b.parent,b.leafNode,b.step,b.icon ' +
                'from role a,menu b '+
                'where a.menuNode=b.node and a.groupId="'+roleId+'" '+
                'order by b.parent,b.step ';
        console.log(sql);
        sqlite_db.serialize(function() {
            sqlite_db.all(sql, function(err, rows) {
                if (err) {
                    res.json({
                        code:'1',
                        menu:"NONE"
                    });
                } else {
                    module.exports.nodeList=[];
                    module.exports.html_menu="";
                    module.exports.html_menu+='<div id="side-nav"><ul id="nav">';
                    for(var i=0;i<rows.length;i++)  {
                        var j=0;
                        for( j=0;j<module.exports.nodeList.length;j++){
                            if(module.exports.nodeList[j]==rows[i].node)
                                break;
                        }
                        if(j == module.exports.nodeList.length){
                            module.exports.nodeList[module.exports.nodeList.length]=rows[i].node;
                            module.exports.html_menu+='<li><a href="'+rows[i].url+'">'+ '<i class="'+rows[i].icon+'"></i> '+rows[i].menuName+((rows[i].leafNode=="false") ? ('<i class="arrow icon-angle-left"></i></a>') : '</a>');
                            module.exports.getChildrenNode(rows[i].node,rows);
                            module.exports.html_menu+='</li>';
                        }
                    }
                    module.exports.html_menu+='</ul></div>';
                    res.json({
                        code:'0',
                        menu: module.exports.html_menu
                    });
                    console.log(module.exports.html_menu);
                }
            });
        });
    },
    getChildrenNode: function (node,rows) {
        var temp_html_begin='<ul class="sub-menu">';
        var temp_html="";
        var mynode="";
        for(var i=0;i<rows.length;i++){
            if(rows[i].parent==node){
                mynode = rows[i].node;
                temp_html+='<li class="current"><a href="'+rows[i].url+'">'+ ((rows[i].leafNode=="false") ? ('<i class="'+rows[i].icon+'"></i> ') : '')+rows[i].menuName+'<i class="icon-angle-right"></i></a>';
                module.exports.nodeList[module.exports.nodeList.length]=mynode;
                module.exports.getChildrenNode(mynode,rows);
                temp_html+='</li>';
            }
        }
        var temp_html_end='</ul>';
        if("" != temp_html){
            module.exports.html_menu+=temp_html_begin;
            module.exports.html_menu+=temp_html;
            module.exports.html_menu+=temp_html_end;
        }
    }
};
