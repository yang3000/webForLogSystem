/**
 * Created by 21515483 on 2016/9/7.
 */
var API_public={
    page_index:1,
    queryProjectShowByPage:function (page){
        API_public.page_index=page;
        $.ajax({
            url: '/query_projectLog',
            type: 'post',
            data: {page:page},
            dataType: 'json',
            success: function (data_dao) {
                var data = data_dao.data;
                $('#tbody_project_log').empty();
                var HTML_project_data="";
                for(var i=0;i<data.length;i++){
                    HTML_project_data+="<tr>"
                    HTML_project_data+="<td>"+data[i].name_cn+"</td>";
                    HTML_project_data+="<td>"+data[i].name+"</td>";
                    HTML_project_data+="<td>"+data[i].times+"</td>";
                    HTML_project_data+="<td>"+data[i].lastTime+"</td>";
                    HTML_project_data+="</tr>";
                }
                $('#tbody_project_log').append(HTML_project_data);

                $('#page_id').empty();

                var HTML_page = "<li "+(API_public.page_index > 1 ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryPrevPage();' id=\"prev\">Prev</a></li>";
                for(var i=0;i<data_dao.page_count;i++){
                    if(API_public.page_index == i+1)
                        HTML_page+="<li><a style=\"background-color:rgba(0, 0, 0, 0.15)\" href=\"javascript:API_public.queryProjectShowByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                    else
                        HTML_page+="<li><a href=\"javascript:API_public.queryProjectShowByPage("+(i+1)+");\">"+(i+1)+"</a></li>";
                }
                HTML_page+="<li "+(API_public.page_index < data_dao.page_count ? "":"class=\"disabled\"")+"><a href='javascript:API_public.queryNextPage("+data_dao.page_count+");' id=\"next\">Next</a></li>";
                $('#page_id').append(HTML_page);
            },
            error: function () {
                window.location.href="/login";
            }
        });
    },

    queryPrevPage:function(){
        if(API_public.page_index>1)
            API_public.queryProjectShowByPage(API_public.page_index-1);
    },
    queryNextPage:function(pages){
        if(API_public.page_index < pages)
            API_public.queryProjectShowByPage(API_public.page_index+1);
    }
};

$(function()
{

});
