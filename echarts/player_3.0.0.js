var stepped = 0, chunks = 0, rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var data_table={length:0,legend:"",data_x:[],data_y:[],count:[]};

$(function()
{
	$('#submit-parse').click(function()
	{
        var files = $('#files')[0].files;
        var config = buildConfig();
		if (files.length > 0)
			{
				//if (!$('#stream').prop('checked') && !$('#chunk').prop('checked'))
				//{

					for (var i = 0; i < files.length; i++)
					{
						if (files[i].size > 1024 * 1024 * 10)
						{
							alert("A file you've selected is larger than 10 MB; please choose to stream or chunk the input to prevent the browser from crashing.");
							return;
						}
					}
				//}
				start = performance.now();
				$('#files').parse({
					config: config,
					before: function(file, inputElem)
					{
						console.log("Parsing file:", file);
					},
					complete: function()
					{
		        		// 基于准备好的dom，初始化echarts图表
						var dom = document.getElementById("main");
						var myChart = echarts.init(dom);
						option = {
							title : {
								text: '男性女性身高体重分布',
								subtext: '抽样调查来自: Heinz  2003'
							},
							grid: {
								left: '3%',
								right: '7%',
								bottom: '3%',
								containLabel: true
							},
							tooltip : {
								trigger: 'axis',
								showDelay : 0,
								formatter : function (params) {
									if (params.value.length > 1) {
										return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
									}
									else {
										return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
									}
								},
								axisPointer:{
									show: true,
									type : 'cross',
									lineStyle: {
										type : 'dashed',
										width : 1
									}
								}
							},
							legend: {
								data: ['女性','男性'],
								left: 'center'
							},
							xAxis : [
								{
									type : 'value',
									scale:true,
									axisLabel : {
										formatter: '{value} cm'
									},
									splitLine: {
										show: false
									}
								}
							],
							yAxis : [
								{
									type : 'value',
									scale:true,
									axisLabel : {
										formatter: '{value} kg'
									},
									splitLine: {
										show: false
									}
								}
							],
							series : [
								{
									name:'女性',
									type:'scatter',
									data: [
										[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
										[170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
										[172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
										[147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
										[159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
										[174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
										[154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
										[162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
										[168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
										[167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
										[167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
										[168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
										[156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
										[162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
										[151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
										[164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
										[170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
										[163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
										[161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
										[159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
										[161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
										[171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
										[166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
										[159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
										[162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
										[172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
										[162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
										[158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
										[167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
										[170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
										[160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
										[166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
										[170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
										[167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
										[160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
										[177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
										[172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
										[175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
										[165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
										[168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
										[162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
										[157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
										[172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
										[161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
										[152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
										[160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
										[167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
										[175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
										[174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
										[156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
										[169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
										[176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
									]
								},
								{
									name:'男性',
									type:'scatter',
									data: [
										[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
										[181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
										[180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
										[184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
										[176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
										[178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
										[183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
										[170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
										[186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
										[182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
										[169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
										[163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
										[177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
										[167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
										[171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
										[174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
										[180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
										[180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
										[175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
										[176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
										[184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
										[157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
										[165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
										[185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
										[177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
										[188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
										[166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
										[185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
										[190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
										[176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
										[172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
										[167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
										[172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
										[193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
										[167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
										[188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
										[171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
										[182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
										[188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
										[175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
										[177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
										[174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
										[167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
										[175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
										[177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
										[174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
										[174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
										[180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
										[170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
										[180.3, 83.2], [180.3, 83.2]
									]
								}
							]
						};
						/*var data_series=[];
						for(var i=0;i< 1*//*data_table.length*//*;i++){
							var length_x = data_table.length;
							var markPoint = {
							//symbol : 'arrow',
							data : []
							};
							for(var j=0;j<length_x;j++){
								var markPoint_data_value = 100*data_table.data_y[j]/data_table.count[j];
								markPoint_data_value = Math.round(100*markPoint_data_value)/100;
								var markPoint_data = {
									name : 'Fail rate',
									value :markPoint_data_value,
									xAxis :data_table.data_x[j],
									yAxis :data_table.data_y[j],
									symbolSize :12
								};
								markPoint.data[j] = markPoint_data;
							}
							var series_Element={
								"name":data_table.legend,
								"type":"bar",
								"data":data_table.data_y,
								itemStyle: {
									normal: {
										label: {
											show: true,
											position: 'inside',
											formatter: '{c}'
										}
									}
								},
								"markPoint" : markPoint
							};
							data_series[i] = series_Element;
						}
						option = {
							title: {
					                	//padding:10,
								text: 'Tester fail rate'//,
					                	//subtext: 'Tester fail rate'
							},
							tooltip: {
								show: true,
								trigger:'axis'
							},
							legend: {
								x : 'left',
								y : 30,
								data:[data_table.legend]
							},
							dataZoom : {
								show : true,
							// realtime : true,
								y:450,
								start : 0,
								end : 100
							},
							xAxis : [
								{
									type : 'category',
									name : 'tester',
									data : data_table.data_x,
									axisLabel : {
										show:true,
										interval: 0,//,    // {number}
										rotate: -60,
										margin: 2
									}
								}
							],
							grid: { // 控制图的大小，调整下面这些值就可以，
								x : 40,
								y : 120,
								x2: 60,
								y2: 165
							},
							yAxis : [
								{
									type : 'value',
									name : 'fail count'
								}
							],
							series : data_series
						};
					             // 为echarts对象加载数据
						myChart.setOption(option);
					               // data_table={length:0,legend:"Testers",data_x:[],data_y:[]};
						data_table.length=0;
					               // data_table.legend="Testers";
						data_table.data_x=[];
						data_table.data_y=[];
						data_table.count=[];*/
						myChart.setOption(option, true);
						console.log("Done with all files.");
					}
				});
			}
	});

	$('#insert-tab').click(function()
	{
		$('#delimiter').val('\t');
	});
	$('#ajax_button').click(function()
	{
		var dom = document.getElementById("main");
		var myChart = echarts.init(dom);

		$.ajax({
			url: '/ajax',
			type: 'get',
			dataType: 'json',
			success:function(data){
				//alert(data.length);
				var html="";
				var data1=[];
				for(var i=0;i<data.length;i++){
					html+="<div>"+data[i].value+"   "+data[i].DUT_POSITION+"</div>";
					var element=[];
					element[1]=data[i].DUT_POSITION;
					element[0]=data[i].value;
					data1[i] =element;
				}
				//alert(data1[3]);
				$('#main1').html(html);
				option.legend={data: ['LAY-ASS-07'], left: 'center'};
				option.series=[
					{
						name:'LAY-ASS-07',
						type:'scatter',
						data:data1,
						symbolSize:5,
						markLine : {
							lineStyle: {
								normal: {
									type: 'solid'
								}
							},
							data : [
								{ xAxis: 14400 },
								{ xAxis: 9900 }
							]
						}
					}
				]
				myChart.setOption(option, true);
			},
			error:function(){
			}
		});
	});
	$('#test').click(function()
	{
		$("#yhyh").children().append('<li>time: <input type="text" class="search" /></li>');

	});
	$('#search_detail').click(function()
	{
		//$("#yhyh").children().append('<li>time: <input type="text" class="search" /></li>');
		var csn =$("#csn").val();
		var data = {"csn":csn};
		$.ajax({
			url: '/get_detail',
			type: 'post',
			data: data,
			dataType: 'json',
			success:function(data){
				var items = data.items;
				var items_data = data.data;
				var json = JSON.stringify(items);
				$("#value_id").children().remove();
				//item_id
				var li_element = '<ul>';


				for(var i_index=0;i_index<items.length;i_index++) {
					var width_data = 220;
					var input_element ='';
					for (var i = 0; i < items_data.length; i++) {
						width_data+=135;
						input_element+='<input readonly="readonly" type="text" class="search" title="'+
						items[i_index].COLUMN_NAME+
						'" value="' + eval("items_data[" + i + "]."+items[i_index].COLUMN_NAME)+'" />&nbsp;';
					}
					li_element += '<li><div style="width: '+width_data+'px;"><span  class="item">' + items[i_index].COLUMN_NAME + ' </span>';
					li_element += input_element;
					li_element += '</div></li>';
				}
				li_element +='</ul>';

				$("#value_id").append(li_element);
				//$("#yhyh").children().append('<li>time: <input type="text" class="search" /></li>');
				//alert(json);
			},
			error:function(){
			}
		});

	});

	$('#bar_button').click(function()
	{
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
});



function buildConfig()
{
	return {
		delimiter: $('#delimiter').val(),
		newline: "",//"\r\n","\n","\r"
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		error: errorFn,
		download: $('#download').prop('checked'),
		fastMode: $('#fastmode').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
		beforeFirstChunk: undefined
	};

}

function stepFn(results, parserHandle)
{
	stepped++;
	rows += results.data.length;

	parser = parserHandle;
	
	if (pauseChecked)
	{
		console.log(results, results.data[0]);
		parserHandle.pause();
		return;
	}
	
	if (printStepChecked)
		console.log(results, results.data[0]);
}

function chunkFn(results, streamer, file)
{
	if (!results)
		return;
	chunks++;
	rows += results.data.length;

	parser = streamer;

	if (printStepChecked)
		console.log("Chunk data:", results.data.length, results);

	if (pauseChecked)
	{
		console.log("Pausing; " + results.data.length + " rows in chunk; file:", file);
		streamer.pause();
		return;
	}
}

function errorFn(error, file)
{
	console.log("ERROR:", error, file);
}

function completeFn()
{
	end = performance.now();
	if (	!$('#stream').prop('checked')
			&& !$('#chunk').prop('checked')
			&& arguments[0]
			&& arguments[0].data
		)
	rows = arguments[0].data.length;
	var data = arguments[0].data;
	var data_x = [];
	var data_y = [];
	var m = 0;
	var n = 0;
	var cols = data[0].length;
	var count = 0;
	for (var i = 1; i < rows; i++){
		if(data[i][4] == "Failed"){
			if(data[i][4])
			//alert(data[i][4]);
			count++;
		}
	}


	data_length = data_table.length;
	var str_fileName = arguments[1].name;
	//data_table.legend[data_length]="Time:"+str_fileName.substr(0,str_fileName.indexOf("_"))+"_Input:"+(rows-2);
	data_table.legend = "Time:"+str_fileName.substr(11,str_fileName.indexOf("_PCBA")-11);
	data_table.data_x[data_length] = str_fileName.substr(0,10);
	data_table.data_y[data_length] = count;
	data_table.count[data_length] = rows-2;
	data_table.length = data_length + 1;

/*
	for (var i = 0; i < cols; i++) {//修改i的值可统计少量的测试项
		if(data[0][i] == "TestName"){
			var i_rows = 1;
			while( i_rows<rows ){
				if( ( "" != data[i_rows][i] ) && ( "0" != data[i_rows][i]) && ( null != data[i_rows][i])) {
					//alert(data[i_rows][i]);
					data_x[m++] = data[i_rows][i];
					break;
				}
				i_rows++;
			}
			if(i_rows == rows){
				//alert(data[1-1][i]);
				data_x[m++] = "0";
			}
			for(var index = 1; index <10; index ++){
				if("TestResult" == data[0][i+index]){
					//alert(data[0][i+index]);
					var count =0;
					for(var j =0 ; j< rows ;j++){
						if("Failed" == data[j][i+index])
							count ++;
					}
					data_y[n++] = count;
					break;
				}
			}
		}
	}

	data_length = data_table.length;
	var str_fileName = arguments[1].name;
	data_table.legend[data_length]="Time:"+str_fileName.substr(0,str_fileName.indexOf("_"))+"_Input:"+(rows-2);
	data_table.data_x[data_length] = data_x;
	data_table.data_y[data_length] = data_y;
	data_table.count[data_length] = rows-2;
	data_table.length = data_length + 1;
	*/
	console.log("Finished input (async). Time:", end-start, arguments);
	console.log("Rows:", rows, "Stepped:", stepped, "Chunks:", chunks);
}
