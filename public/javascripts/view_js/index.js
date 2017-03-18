var stepped = 0, chunks = 0, rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var data_table={length:0,legend:"",data_x:[],data_y:[],count:[]};
var data_list=[];
$(function()
{

    $("#yhyh").children().empty();
    alert(3232);
    var d=new Date("2016-07-20");
    d.setDate(d.getDate()-7);
    //alert(years+"-"+months+"-"+days);
    for(var i=0;i<7;i++){
        d.setDate(d.getDate()+1);
        var years = d.getFullYear();
        var months = (d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1);
        var days = d.getDate() <10 ? "0" + d.getDate() : d.getDate();
        data_list[i] = years+"-"+months+"-"+days;

    }
    alert(data_list);
    var dom = document.getElementById("main");
    var myChart = echarts.init(dom);
   // myChart.setOption(option_line, true);
    option_line.xAxis.data = data_list;
    //option_line.series[0] = data_series;
    $.ajax({
        url: '/get_FirstYeild_SA_MTF',
        type: 'post',
        data: data,
        dataType: 'json',
        success:function(data){
            var length_JSON = data.data.length;
            var data_JSON = data.data;
            var station_id="";
            var index_date =0;
            var series_data=[];
            option_line.legend.data=[];
            for(var i=0;i<length_JSON;i++){
                if(data_JSON[i].Station_ID != station_id)
                {
                    if(i>0){
                        while (index_date < 7){
                            series_data[series_data.length] = 100;
                            index_date++;
                        }
                        var data_series = {
                            name:'',
                            type:'line',
                            data:[]
                        };
                        data_series.data=series_data;
                        data_series.name = station_id;
                        option_line.series[option_line.series.length] = data_series;
                    }
                    station_id = data_JSON[i].Station_ID;
                    index_date = 0;
                    series_data=[];
                    while (index_date < 7){
                        if(data_list[index_date] == data_JSON[i].date){
                            series_data[series_data.length] = data_JSON[i].first_yeild;
                            index_date++;
                            break;
                        }
                        else
                            series_data[series_data.length] = 100;
                        index_date++;
                    }
                    option_line.legend.data[option_line.legend.data.length] =station_id;
                }
                else
                {
                    if(data_list[index_date] == data_JSON[i].date)
                    {
                        series_data[series_data.length] = data_JSON[i].first_yeild;
                        index_date++;
                    }
                    else
                    {
                        while (index_date < 7){
                            if(data_list[index_date] == data_JSON[i].date){
                                series_data[series_data.length] = data_JSON[i].first_yeild;
                                index_date++;
                                break;
                            }
                            else
                                series_data[series_data.length] = 100;
                            index_date++;
                        }
                    }
                }
            }
           // alert( JSON.stringify(option_line));
            //option_bar.series =series_data;
            myChart.setOption(option_line, true);
        },
        error:function(){}
    });
        return;


        $("#yhyh").children().empty();
        var dom = document.getElementById("main");
        var myChart = echarts.init(dom);

        var first_fail =$("#first_fail").val();
        var data = {"testItem":first_fail,"upwd":"34546546"};
        $.ajax({
            url: '/get_bar',
            type: 'post',
            data: data,
            dataType: 'json',
            success:function(data){
                var html="";
                var data1=[];
                var legend_data=['1','2','3','4','5','6','7','8','9','10','11','12'];
                var xAxis_data=[];
                //var series_data=[];
                var series_data=[	{name:'1',type:'bar',stack:'total',data:[]},
                    {name:'2',type:'bar',stack:'total',data:[]},
                    {name:'3',type:'bar',stack:'total',data:[]},
                    {name:'4',type:'bar',stack:'total',data:[]},
                    {name:'5',type:'bar',stack:'total',data:[]},
                    {name:'6',type:'bar',stack:'total',data:[]},
                    {name:'7',type:'bar',stack:'total',data:[]},
                    {name:'8',type:'bar',stack:'total',data:[]},
                    {name:'9',type:'bar',stack:'total',data:[]},
                    {name:'10',type:'bar',stack:'total',data:[]},
                    {name:'11',type:'bar',stack:'total',data:[]},
                    {name:'12',type:'bar',stack:'total',data:[]}
                ];
                //var index_station=0;
                var index_before_station =0;
                for(var i=0;i<data.length;i++){
                    html+="<div>"+data[i].time + "   "+data[i].STATION_ID+"   "+data[i].DUT_POSITION+"   "+data[i].total+"</div>";
                    var xAxis_length = xAxis_data.length;
                    if((xAxis_length == 0) ||
                        ((xAxis_data[xAxis_length-1]) != data[i].STATION_ID)
                    )
                    {
                        if(index_before_station != 0){
                            for(var j = index_before_station;j<12;j++){
                                series_data[j].data[xAxis_length-1] = 0;
                            }
                        }
                        xAxis_data[xAxis_length] = data[i].STATION_ID;
                        var length = data[i].DUT_POSITION;
                        for(var k = 0; k < length-1; k++){
                            series_data[k].data[xAxis_length] = 0;
                        }
                        series_data[length-1].data[xAxis_length] = data[i].total;
                        index_before_station = data[i].DUT_POSITION;
                    }
                    xAxis_length = xAxis_data.length;
                    //
                    if((xAxis_length != 0) &&
                        ((xAxis_data[xAxis_length-1]) == data[i].STATION_ID)
                    ){
                        var length = data[i].DUT_POSITION;
                        for(var l=index_before_station;l<length-1;l++){
                            series_data[l].data[xAxis_length-1] = 0;
                        }
                        series_data[length-1].data[xAxis_length-1] = data[i].total;
                        index_before_station = data[i].DUT_POSITION;
                    }
                }
                for(var j = index_before_station;j<12;j++){
                    series_data[j].data[xAxis_length-1] = 0;
                }
                var json = JSON.stringify(series_data);

                option_bar.legend= {data:legend_data};
                option_bar.xAxis= [{
                    type : 'category',
                    data : xAxis_data,
                    axisLabel : {
                        show:true,
                        interval: 0,//,    // {number}
                        rotate: -60,
                        margin: 2
                    }
                }];
                option_bar.series =series_data;
                myChart.setOption(option_bar, true);
            },
            error:function(){
            }
        });
});



