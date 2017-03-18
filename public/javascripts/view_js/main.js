$(function()
{

    $.ajax({
        url: '/query_menu_info',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function (data) {
            $('#menu_id').empty();
            $('#menu_id').append(data.menu);
            jQuery('#nav li').on('click', function(e) {
                jQuerythis = jQuery(this);
                e.stopPropagation();
                if(jQuerythis.has('ul').length) {
                    e.preventDefault();
                    var visibleUL = jQuery('#nav').find('ul:visible').length;
                    var ele_class = jQuery('ul', this).attr("class");
                    if(ele_class != 'sub-menu opened')
                    {
                        jQuery('#nav').find('ul:visible').slideToggle("normal");
                        jQuery('#nav').find('ul:visible').removeClass("opened");
                        jQuery('.icon-angle-down').addClass("closing");
                        jQuery('.closing').removeClass("icon-angle-down");
                        jQuery('.closing').addClass("icon-angle-left");
                        jQuery('.icon-angle-left').removeClass("closing");
                    }
                    jQuery('ul', this).slideToggle("normal");
                    if(ele_class == 'sub-menu opened')
                    {
                        jQuery('ul', this).removeClass("opened");
                        jQuery('.arrow', this).removeClass("icon-angle-down");
                        jQuery('.arrow', this).addClass("icon-angle-left");
                    }
                    else
                    {
                        jQuery('ul', this).addClass("opened");
                        jQuery('.arrow', this).removeClass("icon-angle-left");
                        jQuery('.arrow', this).addClass("icon-angle-down");
                    }
                }

            });
        },
        error: function () {

        }
    });
    $.ajax({
        url: '/get_userName',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function (data) {
            $('#head_userName_id').html("&nbsp;"+data.userName+"&nbsp;");
        },
        error: function () {

        }
    });
});
