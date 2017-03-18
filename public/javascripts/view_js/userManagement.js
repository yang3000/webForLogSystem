/**
 * Created by 21515483 on 2016/9/7.
 */
var API_public;
API_public = {
    page_index:1,
    flag_save_edit:0,
    id_user:-1,
    deleteUserDataById: function (id) {
        $.ajax({
            url: '/delete_userInfo',
            type: 'post',
            data: {log:10,index: id},
            dataType: 'json',

            success: function (data) {
                API_public.queryUserDataByPage(API_public.page_index);
            },
            error: function () {
            }
        });
    },
    editUserDataById:function (id){
        $.ajax({
            url: '/eidt_userInfo',
            type: 'post',
            data: {index:id},
            dataType: 'json',
            success: function (data) {
                if(data.code=='1'){
                    alert(data.msg);
                }else{
                   // API_public.queryDepartment(data.data.department);
                    API_public.queryRole(data.data.roleId);

                    $('#name_en').val(data.data.userName);
                    //$('#password').val(data.data.password);
                    $('#name_cn').val(data.data.name);

                   //$('#password').val(data_menu.remark);
                    $('#myModal').modal('show');
                    API_public.flag_save_edit = 1;
                    API_public.id_user = id;
                }
                //  API_public.queryUserGroupByPage(API_public.page_index);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    queryUserDataByPage: function (page) {
        API_public.page_index = page;
        $.ajax({
            url: '/query_userInfo',
            type: 'post',
            data: {page: page},
            dataType: 'json',
            success: function (data_dao) {

                var data = data_dao.data;
                if(data_dao.page_count <= 0)
                    return;
                if(data.length <= 0){
                    API_public.queryUserDataByPage(page-1);
                }else{
                    $('#tbody_user_data').empty();
                    var HTML_user_data = "";
                    // var json = JSON.stringify(data);
                    for (var i = 0; i < data.length; i++) {
                        HTML_user_data += "<tr>"
                        HTML_user_data += "<td>" + data[i].rownum + "</td>";
                        HTML_user_data += "<td>" + data[i].name + "</td>";
                        HTML_user_data += "<td>" + data[i].userName + "</td>";
                        HTML_user_data += "<td>" + data[i].groupName + "</td>";
                        HTML_user_data += "<td class=\"td-actions\">" +
                            "<a href=\"javascript:API_public.editUserDataById(" + data[i].id + ");\" class=\"btn btn-small btn-success\"><i class=\"btn-icon-only icon-ok\"></i></a>" +
                            "<a href=\"javascript:API_public.deleteUserDataById(" + data[i].id + ");\" class=\"btn btn-danger btn-small\"><i class=\"btn-icon-only icon-remove\"></i></a>" +
                            "</td>";
                        HTML_user_data += "</tr>";
                    }
                    $('#tbody_user_data').append(HTML_user_data);

                    $('#page_id').empty();

                    var HTML_page = "<li "+(API_public.page_index > 1 ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryPrevPage();' id=\"prev\">Prev</a></li>";
                    for(var i=0;i<data_dao.page_count;i++){
                        if(API_public.page_index == i+1)
                            HTML_page+="<li><a style=\"background-color:rgba(0, 0, 0, 0.15)\" href=\"javascript:API_public.queryUserDataByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                        else
                            HTML_page+="<li><a href=\"javascript:API_public.queryUserDataByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                    }
                    HTML_page+="<li "+(API_public.page_index < data_dao.page_count ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryNextPage("+data_dao.page_count+");' id=\"next\">Next</a></li>";
                    $('#page_id').append(HTML_page);
                }

            },
            error: function () {
            }
        });
    },
    saveUserData: function () {
        var parma = publicFunction.getFromData("myModal");
        parma.edit_save = API_public.flag_save_edit;
        parma.id_user = API_public.id_user;
        parma.log=5;
        $.ajax({
            url: '/save_userInfo',
            type: 'post',
            data: parma,
            dataType: 'json',
            success: function (data) {
                if(data.code=='1'){
                    alert(data.msg);
                }else {
                    API_public.queryUserDataByPage(API_public.page_index);
                    $('#myModal').modal('hide');
                }
            },
            error: function () {
            }
        });
    },
    queryDepartment: function (index) {
        $.ajax({
            url: '/query_department',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                $('#department').empty();
                $('#department').append(API_public.getOption(data.data));
                if(index!=0)
                    $('#department').val(index);
            },
            error: function () {
            }
        });
    },
    queryJobTile: function (index) {
        $.ajax({
            url: '/query_jobTitle',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                $('#position').empty();
                $('#position').append(API_public.getOption(data.data));
                if(index!=0)
                    $('#position').val(index);
            },
            error: function () {
            }
        });
    },
    queryRole: function (index) {
        $.ajax({
            url: '/query_role',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                $('#roleId').empty();
                var Html_role="";//="<option value=\"-1\">pls choose userGroup!</option>";
                Html_role+=API_public.getOption(data.data);
                $('#roleId').append(Html_role);
                if(index!=0)
                    $('#roleId').val(index);
            },
            error: function () {
            }
        });
    },
    getOption: function (data) {
        var HTML_data = "";
        for (var i = 0; i < data.length; i++) {
            HTML_data += "<option value=\"" + data[i].code + "\">" + data[i].name + "</option>"
        }
        return HTML_data;
    },
    queryPrevPage:function(){
        if(API_public.page_index>1)
            API_public.queryUserDataByPage(API_public.page_index-1);
    },
    queryNextPage:function(pages){
        if(API_public.page_index < pages)
            API_public.queryUserDataByPage(API_public.page_index+1);
    }
};

$(function()
{
    //
    $('#save_id').click(function() {
        API_public.saveUserData();
    });

    //
    $('#open_model').click(function() {
        API_public.queryRole(0);
        $('#myModal').modal('show');
        API_public.flag_save_edit = 0;
        API_public.id_user = -1;
    });

    //
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myModal').find('input,select').each(
            function (){
                $(this).val("");
            }
        )
    })
});
