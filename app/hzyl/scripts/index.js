$(function() {
	echart_1();
	echart_2();
	echart_3();
	echart_map();

	//echart_1湖南货物收入
	function echart_1() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('chart_1'));
		option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c}件"
			},
			legend: {
				x: 'center',
				y: '15%',
				data: ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
				icon: 'circle',
				textStyle: {
					color: '#fff',
				}
			},
			calculable: true,
			series: [{
				name: '',
				type: 'pie',
				//起始角度，支持范围[0, 360]
				// startAngle: 0,
				//饼图的半径，数组的第一项是内半径，第二项是外半径
				radius: '45%',
				//支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
				center: ['60%', '65%'],
				//是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
				// 'radius' 面积展现数据的百分比，半径展现数据的大小。
				//  'area' 所有扇区面积相同，仅通过半径展现数据大小
				// roseType: 'radius',
				//是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
				// avoidLabelOverlap: false,
				label: {
					normal: {
						show: true,
						formatter: '{b}{c}万件'
					},
					emphasis: {
						show: true
					}
				},
				labelLine: {
					normal: {
						show: true,
						length2: 1,
					},
					emphasis: {
						show: true
					}
				},
				data: [{
						value: 25097.63,
						name: '南宁市',
						itemStyle: {
							normal: {
								color: '#f845f1'
							}
						}
					},
					{
						value: 4740.16,
						name: '柳州市',
						itemStyle: {
							normal: {
								color: '#ad46f3'
							}
						}
					},
					{
						value: 2931.79,
						name: '桂林市',
						itemStyle: {
							normal: {
								color: '#5045f6'
							}
						}
					},
					{
						value: 1174.27,
						name: '梧州市',
						itemStyle: {
							normal: {
								color: '#4777f5'
							}
						}
					},
					{
						value: 1423.21,
						name: '北海市',
						itemStyle: {
							normal: {
								color: '#44aff0'
							}
						}
					},
					{
						value: 1132.37,
						name: '防城港市',
						itemStyle: {
							normal: {
								color: '#45dbf7'
							}
						}
					},
					{
						value: 929.50,
						name: '钦州市',
						itemStyle: {
							normal: {
								color: '#f6d54a'
							}
						}
					},
					{
						value: 1555.20,
						name: '贵港市',
						itemStyle: {
							normal: {
								color: '#f69846'
							}
						}
					},
					{
						value: 4881.52,
						name: '玉林市',
						itemStyle: {
							normal: {
								color: '#ad46f3'
							}
						}
					},
					{
						value: 1114.72,
						name: '百色市',
						itemStyle: {
							normal: {
								color: '#32C12E'
							}
						}
					},
					{
						value: 605.85,
						name: '贺州市',
						itemStyle: {
							normal: {
								color: '#90F5AA'
							}
						}
					},
					{
						value: 596.23,
						name: '河池市',
						itemStyle: {
							normal: {
								color: '#F46852'
							}
						}
					},
					{
						value: 419.44,
						name: '来宾市',
						itemStyle: {
							normal: {
								color: '#eaf048'
							}
						}
					},
					{
						value: 1499.18,
						name: '崇左市',
						itemStyle: {
							normal: {
								color: '#9ff048'
							}
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					},
					{
						value: 0,
						name: "",
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				]
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	//电子商务销售额、订单数
	function echart_2() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('chart_2'));
		myChart.clear();
		option = {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['销售额', '订单数'],
				textStyle: {
					color: '#fff'
				},
				top: '8%'
			},
			grid: {
				top: '40%',
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			color: ['#FF4949', '#FFA74D', '#FFEA51', '#4BF0FF', '#44AFF0', '#4E82FF', '#584BFF', '#BE4DFF', '#F845F1'],
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['2018年9月', '2018年10月', '2018年11月', '2018年12月', '2019年1月'],
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				}
			},
			yAxis: {
				name: '',
				type: 'value',
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				}
			},
			series: [{
					name: '销售额',
					type: 'line',
					data: [3961.88, 4233.63, 4183.14, 3633.01, 3704.47]
				},
				{
					name: '订单数',
					type: 'line',
					data: [3374.76, 3364.76, 3274.76, 3371.82, 3259.87]
				}
			]
		};
		myChart.setOption(option);
	}

	// echart_map中国地图
	function echart_map() {
		var myChart = echarts.init(document.getElementById('chart_map'));
		var geoCoordMap = {
			"1": [119.2070396626, 26.0471838188],
			"2": [119.2147498638, 26.0481609598],
			"3": [119.209339, 26.038355],
			"4": [119.2163806469, 26.0442086921],
			"5": [119.2132263691, 26.0498767809],
			"6": [119.219382299, 26.0524969442],
			"7": [119.2194920093, 26.0496647145],
			"8": [119.2194276363, 26.0475440293],
			"9": [119.225689, 26.044945],
			"10": [119.215699, 26.045237],
			"11": [119.2191260061, 26.0366349971],
			"12": [119.212969, 26.039069]
		};
		var oneData = [
			[{
					name: "1"
				},
				{
					name: "2",
					value: 20
				}
			],
			[{
					name: "1"
				},
				{
					name: "3",
					value: 20
				}
			],
			[{
					name: "1"
				},
				{
					name: "4",
					value: 20
				}
			]
		];
		var twoData = [
			[{
					name: "5"
				},
				{
					name: "6",
					value: 20
				}
			],
			[{
					name: "5"
				},
				{
					name: "7",
					value: 20
				}
			],
			[{
					name: "5"
				},
				{
					name: "8",
					value: 20
				}
			]
		];
		var threeData = [
			[{
					name: "9"
				},
				{
					name: "10",
					value: 20
				}
			],
			[{
					name: "9"
				},
				{
					name: "11",
					value: 20
				}
			],
			[{
					name: "9"
				},
				{
					name: "12",
					value: 20
				}
			]
		];

		var planePath =
			"path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

		var convertData = function(data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var dataItem = data[i];
				var fromCoord = geoCoordMap[dataItem[1].name];
				var toCoord = geoCoordMap[dataItem[0].name];
				if (fromCoord && toCoord) {
					res.push({
						fromName: dataItem[1].name,
						toName: dataItem[0].name,
						coords: [fromCoord, toCoord]
					});
				}
			}
			return res;
		};

		var color = ["#a6c84c", "#ffa022", "#46bee9"];
		var series = [];
		[
			["1", oneData],
			["5", twoData],
			["9", threeData]
		].forEach(function(
			item,
			i
		) {
			series.push({
				name: item[0],
				type: "effectScatter",
				coordinateSystem: "bmap",
				zlevel: 2,
				rippleEffect: {
					brushType: "stroke"
				},
				label: {
					normal: {
						show: true,
						position: "right",
						formatter: "{b}"
					}
				},
				symbolSize: function(val) {
					return val[2] / 4;
				},
				showEffectOn: "render",
				itemStyle: {
					normal: {
						color: color[i]
					}
				},
				data: [{
					name: item[0],
					value: geoCoordMap[item[0]].concat([100])
				}]
			}, {
				name: item[0] + " Top10",
				type: "lines",
				coordinateSystem: "bmap",
				zlevel: 1,
				effect: {
					show: true,
					period: 6,
					trailLength: 0.7,
					color: "#fff",
					symbolSize: 3
				},
				lineStyle: {
					normal: {
						color: color[i],
						width: 0,
						curveness: 0.2
					}
				},
				data: convertData(item[1])
			}, {
				name: item[0] + " Top10",
				type: "lines",
				coordinateSystem: "bmap",
				zlevel: 2,
				effect: {
					show: true,
					period: 6,
					trailLength: 0,
					symbol: planePath,
					symbolSize: 15
				},
				lineStyle: {
					normal: {
						color: color[i],
						width: 1,
						opacity: 0.4,
						curveness: 0.2
					}
				},
				data: convertData(item[1])
			}, {
				name: item[0] + " Top10",
				type: "effectScatter",
				coordinateSystem: "bmap",
				zlevel: 2,
				rippleEffect: {
					brushType: "stroke"
				},
				label: {
					normal: {
						show: true,
						position: "right",
						formatter: "{b}"
					}
				},
				symbolSize: function(val) {
					return val[2] / 4;
				},
				showEffectOn: "render",
				itemStyle: {
					normal: {
						color: color[i]
					}
				},
				data: item[1].map(function(dataItem) {
					return {
						name: dataItem[1].name,
						value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
					};
				})
			});
		});

		var option = {
			bmap: {
				// 百度地图中心经纬度 坐标拾取器http://api.map.baidu.com/lbsapi/getpoint/index.html
				center: [119.2166696096, 26.0446365813],
				// 百度地图缩放等级，数字越大，放大越大，地图比例尺越小
				zoom: 16,
				// 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
				roam: false,
				// mapStyle是百度地图的自定义样式，见 http://developer.baidu.com/map/custom/
				mapStyle: {
					styleJson: [{
							featureType: "water",
							elementType: "all",
							stylers: {
								color: "#021019"
							}
						},
						{
							featureType: "highway",
							elementType: "geometry.fill",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "highway",
							elementType: "geometry.stroke",
							stylers: {
								color: "#147a92"
							}
						},
						{
							featureType: "arterial",
							elementType: "geometry.fill",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "arterial",
							elementType: "geometry.stroke",
							stylers: {
								color: "#0b3d51"
							}
						},
						{
							featureType: "local",
							elementType: "geometry",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "land",
							elementType: "all",
							stylers: {
								color: "#08304b"
							}
						},
						{
							featureType: "railway",
							elementType: "geometry.fill",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "railway",
							elementType: "geometry.stroke",
							stylers: {
								color: "#08304b"
							}
						},
						{
							featureType: "subway",
							elementType: "geometry",
							stylers: {
								lightness: -70
							}
						},
						{
							featureType: "building",
							elementType: "geometry.fill",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "all",
							elementType: "labels.text.fill",
							stylers: {
								color: "#857f7f"
							}
						},
						{
							featureType: "all",
							elementType: "labels.text.stroke",
							stylers: {
								color: "#000000"
							}
						},
						{
							featureType: "building",
							elementType: "geometry",
							stylers: {
								color: "#022338"
							}
						},
						{
							featureType: "green",
							elementType: "geometry",
							stylers: {
								color: "#062032"
							}
						},
						{
							featureType: "boundary",
							elementType: "all",
							stylers: {
								color: "#1e1c1c"
							}
						},
						{
							featureType: "manmade",
							elementType: "geometry",
							stylers: {
								color: "#022338"
							}
						},
						{
							featureType: "poi",
							elementType: "all",
							stylers: {
								visibility: "off"
							}
						},
						{
							featureType: "all",
							elementType: "labels.icon",
							stylers: {
								visibility: "off"
							}
						},
						{
							featureType: "all",
							elementType: "labels.text.fill",
							stylers: {
								color: "#2da0c6",
								visibility: "on"
							}
						},
						{
							featureType: "background",
							elementType: "all",
							stylers: {
								color: "#0e1054ff"
							}
						}
					]
				}
			},
			//series是在地图上的线条等效果的配置文件，具体可以查阅文档。
			series: series
		};

		myChart.setOption(option);

		// window.addEventListener("resize", function() {
		// 	myChart.resize();
		// });
	}

	//echart_3货物周转量
	function echart_3() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('chart_3'));
		myChart.clear();
		option = {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['顺丰快递', '邮政速递', '百世快递', '圆通速递', '中通速递', '申通快递', '韵达快递'],
				textStyle: {
					color: '#fff'
				},
				top: '8%'
			},
			grid: {
				top: '40%',
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			color: ['#FF4949', '#FFA74D', '#FFEA51', '#4BF0FF', '#44AFF0', '#4E82FF', '#584BFF', '#BE4DFF', '#F845F1'],
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['2018年9月', '2018年10月', '2018年11月', '2018年12月', '2019年1月'],
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				}
			},
			yAxis: {
				name: '单',
				type: 'value',
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				}
			},
			series: [{
					name: '顺丰快递',
					type: 'line',
					data: [3961, 4233, 4183, 3633, 3704]
				},
				{
					name: '邮政速递',
					type: 'line',
					data: [3374, 3364, 3274, 3371, 3259]
				},
				{
					name: '百世快递',
					type: 'line',
					data: [14, 15, 13, 14, 15]
				},
				{
					name: '圆通速递',
					type: 'line',
					data: [686, 847, 895, 865, 886]
				},
				{
					name: '中通速递',
					type: 'line',
					data: [6133, 6577, 7019, 6821, 7294]
				},
				{
					name: '申通快递',
					type: 'line',
					data: [509, 862, 1481, 1552, 1333]
				},
				{
					name: '韵达快递',
					type: 'line',
					data: [509, 900, 1350, 1487, 1600]
				}
			]
		};
		myChart.setOption(option);
	}

	//湖南省飞机场
	function echart_5() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('chart_5'));

		function showProvince() {
			var geoCoordMap = {
				'长沙黄花国际机场': [113.226512, 28.192929],
				'张家界荷花机场': [110.454598, 29.107223],
				'常德桃花源机场': [111.651508, 28.921516],
				'永州零陵机场': [111.622869, 26.340994],
				'怀化芷江机场': [109.714784, 27.44615],
			};
			var data = [{
					name: '长沙黄花国际机场',
					value: 100
				},
				{
					name: '张家界荷花机场',
					value: 100
				},
				{
					name: '常德桃花源机场',
					value: 100
				},
				{
					name: '永州零陵机场',
					value: 100
				},
				{
					name: '怀化芷江机场',
					value: 100
				}
			];
			var max = 480,
				min = 9; // todo 
			var maxSize4Pin = 100,
				minSize4Pin = 20;
			var convertData = function(data) {
				var res = [];
				for (var i = 0; i < data.length; i++) {
					var geoCoord = geoCoordMap[data[i].name];
					if (geoCoord) {
						res.push({
							name: data[i].name,
							value: geoCoord.concat(data[i].value)
						});
					}
				}
				return res;
			};

			myChart.setOption(option = {
				title: {
					top: 20,
					text: '',
					subtext: '',
					x: 'center',
					textStyle: {
						color: '#ccc'
					}
				},
				legend: {
					orient: 'vertical',
					y: 'bottom',
					x: 'right',
					data: ['pm2.5'],
					textStyle: {
						color: '#fff'
					}
				},
				visualMap: {
					show: false,
					min: 0,
					max: 500,
					left: 'left',
					top: 'bottom',
					text: ['高', '低'], // 文本，默认为数值文本
					calculable: true,
					seriesIndex: [1],
					inRange: {}
				},
				geo: {
					show: true,
					map: 'hunan',
					mapType: 'hunan',
					label: {
						normal: {},
						//鼠标移入后查看效果
						emphasis: {
							textStyle: {
								color: '#fff'
							}
						}
					},
					//鼠标缩放和平移
					roam: true,
					itemStyle: {
						normal: {
							//          	color: '#ddd',
							borderColor: 'rgba(147, 235, 248, 1)',
							borderWidth: 1,
							areaColor: {
								type: 'radial',
								x: 0.5,
								y: 0.5,
								r: 0.8,
								colorStops: [{
									offset: 0,
									color: 'rgba(175,238,238, 0)' // 0% 处的颜色
								}, {
									offset: 1,
									color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
								}],
								globalCoord: false // 缺省为 false
							},
							shadowColor: 'rgba(128, 217, 248, 1)',
							shadowOffsetX: -2,
							shadowOffsetY: 2,
							shadowBlur: 10
						},
						emphasis: {
							areaColor: '#389BB7',
							borderWidth: 0
						}
					}
				},
				series: [{
						name: 'light',
						type: 'map',
						coordinateSystem: 'geo',
						data: convertData(data),
						itemStyle: {
							normal: {
								color: '#F4E925'
							}
						}
					},
					{
						name: '点',
						type: 'scatter',
						coordinateSystem: 'geo',
						symbol: 'pin',
						symbolSize: function(val) {
							var a = (maxSize4Pin - minSize4Pin) / (max - min);
							var b = minSize4Pin - a * min;
							b = maxSize4Pin - a * max;
							return a * val[2] + b;
						},
						label: {
							normal: {
								// show: true,
								// textStyle: {
								//     color: '#fff',
								//     fontSize: 9,
								// }
							}
						},
						itemStyle: {
							normal: {
								color: '#F62157', //标志颜色
							}
						},
						zlevel: 6,
						data: convertData(data),
					},
					{
						name: 'light',
						type: 'map',
						mapType: 'hunan',
						geoIndex: 0,
						aspectScale: 0.75, //长宽比
						showLegendSymbol: false, // 存在legend时显示
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: false,
								textStyle: {
									color: '#fff'
								}
							}
						},
						roam: true,
						itemStyle: {
							normal: {
								areaColor: '#031525',
								borderColor: '#FFFFFF',
							},
							emphasis: {
								areaColor: '#2B91B7'
							}
						},
						animation: false,
						data: data
					},
					{
						name: ' ',
						type: 'effectScatter',
						coordinateSystem: 'geo',
						data: convertData(data.sort(function(a, b) {
							return b.value - a.value;
						}).slice(0, 5)),
						symbolSize: function(val) {
							return val[2] / 10;
						},
						showEffectOn: 'render',
						rippleEffect: {
							brushType: 'stroke'
						},
						hoverAnimation: true,
						label: {
							normal: {
								formatter: '{b}',
								position: 'right',
								show: true
							}
						},
						itemStyle: {
							normal: {
								color: '#05C3F9',
								shadowBlur: 10,
								shadowColor: '#05C3F9'
							}
						},
						zlevel: 1
					},

				]
			});
		}
		showProvince();

		// 使用刚指定的配置项和数据显示图表。
		// myChart.setOption(option);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}
	//点击跳转
	// $('#chart_map').click(function(){
	//     window.location.href = './page/index.html';
	// });
	// $('.t_btn2').click(function(){
	//     window.location.href = "./page/index.html?id=2";
	// });
	// $('.t_btn3').click(function(){
	//     window.location.href = "./page/index.html?id=3";
	// });
	// $('.t_btn4').click(function(){
	//     window.location.href = "./page/index.html?id=4";
	// });
	// $('.t_btn5').click(function(){
	//     window.location.href = "./page/index.html?id=5";
	// });
	// $('.t_btn6').click(function(){
	//     window.location.href = "./page/index.html?id=6";
	// });
	// $('.t_btn7').click(function(){
	//     window.location.href = "./page/index.html?id=7";
	// });
	// $('.t_btn8').click(function(){
	//     window.location.href = "./page/index.html?id=8";
	// });
	// $('.t_btn9').click(function(){
	//     window.location.href = "./page/index.html?id=9";
	// });
});
