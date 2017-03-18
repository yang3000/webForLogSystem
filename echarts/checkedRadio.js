/**
 * Created by yhorz on 2016/8/7.
 */
$('input[name="radio-btn"]').wrap('<div class="radio-btn"><i></i></div>');
$(".radio-btn").on('click', function () {
    var _this = $(this);
    $("#id-checked-radio").find('input:radio').attr('checked', false);
    $("#id-checked-radio").find(".radio-btn").removeClass('checkedRadio');
    _this.addClass('checkedRadio');
    _this.find('input:radio').attr('checked', true);
});
$(function()
{
    var blod =$("#id-checked-radio").find("#id-checked").parent().parent();
    blod.addClass('checkedRadio');
    blod.find('input:radio').attr('checked', true);
});