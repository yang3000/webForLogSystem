/**
 * Created by 21515483 on 2016/9/7.
 */
var API_public={
    page_index:1,
    flag_save_edit:0,
    id_group:-1,
    deleteUserGroupById:function (id){
        $.ajax({
            url: '/delete_userGroupInfo',
            type: 'post',
            data: {index:id,log:8},
            dataType: 'json',
            success: function (data) {
                API_public.queryUserGroupByPage(API_public.page_index);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    editUserGroupById:function (id){
        $.ajax({
            url: '/edit_userGroupInfo',
            type: 'post',
            data: {index:id},
            dataType: 'json',
            success: function (data) {
                if(data.code=='1'){
                    alert(data.msg);
                }else{
                    var data_menu=data.data;
                    $('#groupName').val(data_menu.groupName);
                    $('#remark').val(data_menu.remark);
                    var data_menuIdList = data_menu.menuIdList;
                    API_public.queryMenuTree(function () {
                        $('#menu_tree').find('input').each(function () {
                            for(var i=0;i<data_menuIdList.length;i++){
                                if($(this).val() == data_menuIdList[i].menuNode)
                                    $(this).prop("checked",true);
                            }
                        })
                    });
                    $('#Modal_UserGroup').modal('show');
                    API_public.flag_save_edit = 1;
                    API_public.id_group = id;
                }
                //  API_public.queryUserGroupByPage(API_public.page_index);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    queryUserGroupByPage:function (page){
        API_public.page_index=page;
        $.ajax({
            url: '/query_userGroupInfo',
            type: 'post',
            data: {page:page},
            dataType: 'json',
            success: function (data_dao) {
                var data = data_dao.data;
               // alert(data_dao.page_count);
                $('#tbody_user_data').empty();
                var HTML_user_data="";
               // var json = JSON.stringify(data);
                for(var i=0;i<data.length;i++){
                    HTML_user_data+="<tr>"
                    HTML_user_data+="<td>"+data[i].rownum+"</td>";
                    HTML_user_data+="<td>"+data[i].groupName+"</td>";
                    HTML_user_data+="<td>"+data[i].creator+"</td>";
                    HTML_user_data+="<td>"+data[i].createTime+"</td>";
                    HTML_user_data+="<td>"+data[i].remark+"</td>";
                    HTML_user_data+="<td class=\"td-actions\">" +
                        "<a href=\"javascript:API_public.editUserGroupById("+data[i].Id+");\" class=\"btn btn-small btn-success\"><i class=\"btn-icon-only icon-ok\"></i></a>" +
                        "<a href=\"javascript:API_public.deleteUserGroupById("+data[i].Id+");\" class=\"btn btn-danger btn-small\"><i class=\"btn-icon-only icon-remove\"></i></a>" +
                        "</td>";
                    HTML_user_data+="</tr>";
                }
                $('#tbody_user_data').append(HTML_user_data);

                $('#page_id').empty();

                var HTML_page = "<li "+(API_public.page_index > 1 ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryPrevPage();' id=\"prev\">Prev</a></li>";
                for(var i=0;i<data_dao.page_count;i++){
                    if(API_public.page_index == i+1)
                        HTML_page+="<li><a style=\"background-color:rgba(0, 0, 0, 0.15)\" href=\"javascript:API_public.queryUserGroupByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                    else
                        HTML_page+="<li><a href=\"javascript:API_public.queryUserGroupByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                }
                HTML_page+="<li "+(API_public.page_index < data_dao.page_count ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryNextPage("+data_dao.page_count+");' id=\"next\">Next</a></li>";
                $('#page_id').append(HTML_page);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    saveUserGroupData:function (){
        var menuIdList=[];
        $('#menu_tree').find('input:checked').each(function () {
            menuIdList[menuIdList.length] = $(this).val();
        });

        $.ajax({
            url: '/save_userGroupInfo',
            type: 'post',
            data: {
                log:7,
                menuIds:JSON.stringify(menuIdList),
                groupName:$('#groupName').val(),
                remark:$('#remark').val(),
                edit_save:API_public.flag_save_edit,
                groupId:API_public.id_group
            },
            dataType: 'json',
            success: function (data) {
                API_public.queryUserGroupByPage(API_public.page_index);
                $('#groupName').val("");
                $('#remark').val("");
                //alert(data.msg);
            },
            error: function () {

            }
        });
    },
    queryMenuTree:function (func){
        $.ajax({
            url: '/query_menuTree',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
              //
                $('#menu_tree').empty();
                $('#menu_tree').append(data.data);
                $('.checker').click(function() {
                    var flag = $(this).find('input').is(':checked');
                    $(this).parent().parent().find('.check-div-child').each(function () {
                        if(flag)
                            $(this).find("input").prop("checked",true);
                        else
                            $(this).find("input").removeAttr("checked");
                    })
                });
                func();
                },
            error: function () {
            }
        });
    },
    getOption:function(data){
        var HTML_data="";
        for(var i=0;i<data.length;i++){
            HTML_data+="<option value=\""+data[i].code+"\">"+data[i].name+"</option>"
        }
        return HTML_data;
    },
    queryPrevPage:function(){
        if(API_public.page_index>1)
            API_public.queryUserGroupByPage(API_public.page_index-1);
    },
    queryNextPage:function(pages){
        if(API_public.page_index < pages)
            API_public.queryUserGroupByPage(API_public.page_index+1);
    }
};

$(function()
{
    //
    $('#saveUserGroup_id').click(function() {
        API_public.saveUserGroupData();
        $('#Modal_UserGroup').modal('hide');
    });

    //
    $('#open_model_userGroup').click(function() {
        //API_public.queryDepartment();
        API_public.queryMenuTree();
        $('#Modal_UserGroup').modal('show');
        API_public.flag_save_edit = 0;
        API_public.id_group = -1;
    });

    //
    $('#Modal_UserGroup').on('hidden.bs.modal', function () {
        $('#Modal_UserGroup').find('input,select').each(
            function (){
                $(this).val("");
            }
        )
    })


});
