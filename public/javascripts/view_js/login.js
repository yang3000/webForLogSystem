/**
 * Created by 21515483 on 2016/9/18.
 */
$(function()
{
    $("#login_id").click(function(){
        var username = $("#UserName").val();
        var password = $("#password").val();
        //if()
        var data = {log:1,"uname":username,"upwd":password};
        $.ajax({
            url:'/dologin',
            type:'post',
            data: data,
            success: function(data_msg){
                if(data_msg.status == '0'){
                    location.href = 'mainPage';
                }
                else
                {
                    $("#errorMsg").html();
                    $("#errorMsg").html(data_msg.msg);
                }
            },
            error: function(data,status){
                alert(1);
                if(status == 'error'){
                    location.href = '/';
                }
            }
        });
    });
    $("#UserName,#password").change(function () {
        $("#errorMsg").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    })
});
