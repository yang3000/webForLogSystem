/**
 * Created by 21515483 on 2016/9/7.
 */
var API_public={
    page_index:1,
    flag_save_edit:0,
    id_project:-1,
    deleteProjectById:function (id){
        $.ajax({
            url: '/delete_projectInfo',
            type: 'post',
            data: {log:11,index:id},
            dataType: 'json',

            success: function (data) {
                if(data.code == 1)
                    alert(data.msg);
                API_public.queryProjectByPage(API_public.page_index);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    editProjectById:function (id){
        $.ajax({
            url: '/edit_projectInfo',
            type: 'post',
            data: {index:id},
            dataType: 'json',
            success: function (data) {
                if(data.code=='1'){
                    alert(data.msg);
                }else{
                    var data_project=data.data;//取出业务数据
                    $('#projectName').val(data_project.projectName);//初始化项目名称框
                    publicFunction.queryDepartment(data_project.department);//初始化部门select框并设置默认值
                    var data_userIdList = data_project.userIdList;//取出属于该项目下的用户列表数据
                   // alert(JSON.stringify(data_userIdList));
                    API_public.queryUserTree(data_project.department,function () {
                        $('#user_tree').find('input').each(function () {
                            for(var i=0;i<data_userIdList.length;i++){
                                if($(this).val() == data_userIdList[i].owner)
                                    $(this).prop("checked",true);
                            }
                        })
                    });
                    $('#Modal_ProjectCreate').modal('show');
                    API_public.flag_save_edit = 1;
                    API_public.id_project = id;
                }
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    queryProjectByPage:function (page){
        API_public.page_index=page;
        $.ajax({
            url: '/query_projectInfo',
            type: 'post',
            data: {page:page},
            dataType: 'json',
            success: function (data_dao) {
                var data = data_dao.data;
                $('#tbody_project_data').empty();
                var HTML_project_data="";
                for(var i=0;i<data.length;i++){
                    HTML_project_data+="<tr>"
                    HTML_project_data+="<td>"+data[i].rownum+"</td>";
                    HTML_project_data+="<td>"+data[i].projectName+"</td>";
                    HTML_project_data+="<td>"+data[i].name+"</td>";
                    HTML_project_data+="<td>"+data[i].creator+"</td>";
                    HTML_project_data+="<td>"+data[i].createTime+"</td>";
                    HTML_project_data+="<td class=\"td-actions\">" +
                        "<a href=\"javascript:API_public.editProjectById("+data[i].projectCode+");\" class=\"btn btn-small btn-success\"><i class=\"btn-icon-only icon-ok\"></i></a>" +
                        "<a href=\"javascript:API_public.deleteProjectById("+data[i].projectCode+");\" class=\"btn btn-danger btn-small\"><i class=\"btn-icon-only icon-remove\"></i></a>" +
                        "</td>";
                    HTML_project_data+="</tr>";
                }
                $('#tbody_project_data').append(HTML_project_data);
                $('#page_id').empty();

                var HTML_page = "<li "+(API_public.page_index > 1 ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryPrevPage();' id=\"prev\">Prev</a></li>";
                for(var i=0;i<data_dao.page_count;i++){
                    if(API_public.page_index == i+1)
                        HTML_page+="<li><a style=\"background-color:rgba(0, 0, 0, 0.15)\" href=\"javascript:API_public.queryProjectByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                    else
                        HTML_page+="<li><a href=\"javascript:API_public.queryProjectByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                }
                HTML_page+="<li "+(API_public.page_index < data_dao.page_count ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryNextPage("+data_dao.page_count+");' id=\"next\">Next</a></li>";
                $('#page_id').append(HTML_page);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    saveProjectData:function (){
        var userIdList=[];
        $('#user_tree').find('input:checked').each(function () {
            userIdList[userIdList.length] = $(this).val();
        });
        $.ajax({
            url: '/save_projectInfo',
            type: 'post',
            data: {
                userIds:JSON.stringify(userIdList),
                department:$('#department').val(),
                projectName:$('#projectName').val(),
                edit_save:API_public.flag_save_edit,
                projectId:API_public.id_project,
                log:4
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 1){
                    alert(data.msg);
                    return;
                }
                API_public.queryProjectByPage(API_public.page_index);
                $('#department').val("");
                $('#projectName').val("");
                $('#Modal_ProjectCreate').modal('hide');
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    queryUserTree:function (department,func){
        $.ajax({
            url: '/query_userList',
            type: 'post',
            data: {
                department:department
            },
            dataType: 'json',
            success: function (data) {
                $('#user_tree').empty();
                $('#user_tree').append(data.data);
                func();
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },
    queryPrevPage:function(){
        if(API_public.page_index>1)
            API_public.queryUserGroupByPage(API_public.page_index-1);
    },
    queryNextPage:function(pages){
        if(API_public.page_index < pages)
            API_public.queryUserGroupByPage(API_public.page_index+1);
    },
    queryDepartment: function (index,func) {
        $.ajax({
            url: '/query_department',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                var data = data.data;
                $('#department').empty();
                $('#department').append(publicFunction.getOption(data));
                if(index!=0)
                    $('#department').val(index);
                func(index!=0 ? index : data[0].code);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    }
};

$(function()
{
    //
    $('#saveProject_id').click(function() {
        API_public.saveProjectData();

    });

    //
    $('#department').change(function(){
        API_public.queryUserTree($(this).val(),function(){});
    })

    //
    $('#open_model_project').click(function() {
        API_public.queryDepartment(0,function (department_id) {
            API_public.queryUserTree(department_id);
        });
        $('#Modal_ProjectCreate').modal('show');
        API_public.flag_save_edit = 0;
        API_public.id_project = -1;
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
