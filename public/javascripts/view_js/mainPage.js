/**
 * Created by yhorz on 2016/8/5.
 */

$(function()
{
    var dom = document.getElementById("chart1");
    var myChart = echarts.init(dom);
    myChart.setOption(option_bar, true);
});