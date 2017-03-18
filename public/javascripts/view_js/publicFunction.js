/**
 * Created by 21515483 on 2016/10/8.
 */
var publicFunction={
    getOption:function(data){
        var HTML_data="";
        for(var i=0;i<data.length;i++){
            HTML_data+="<option value=\""+data[i].code+"\">"+data[i].name+"</option>"
        }
        return HTML_data;
    },
    getFromData:function (fromId){
        var JsonData='{';
            $('#'+fromId).find('input,select').each(
            function (){
                JsonData+='"'+$(this).attr("id")+'":"'+$(this).val()+'",';
            }
        )
        JsonData = JsonData.substr(0,JsonData.length-1);
        JsonData+='}';
        JsonData = eval("(" + JsonData + ")");
        return JsonData;
    },
    queryDepartment: function (index) {
        $.ajax({
            url: '/query_department',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function (data) {
                $('#department').empty();
                $('#department').append(publicFunction.getOption(data.data));
                if(index!=0)
                    $('#department').val(index);
            },
            error: function () {
            }
        });
    }
};