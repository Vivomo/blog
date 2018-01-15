/**
 * 南丁格尔玫瑰图
 */
export default function getRosePieOption(data) {
    const options = [];
    const timelineData = [];
    const legendData = [];
    for (let i = 0; i < data.length; i++) {
        timelineData.push(data[i].time);
        const pieData = data[i].data;
        pieData.forEach((item) => {
            if (legendData.findIndex(ele => ele === item.name) === -1) {
                legendData.push(item.name);
            }
        });
        options.push({
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.name} : ${params.value}`;
                }
            },
            series: [{
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: function (params) {
                                return `${params.name} : ${params.value}`;
                            }
                        }
                    },
                    labelLine: {
                        show: true
                    }
                },
                data: pieData
            }]
        });
    }

    const pieOption = {
        baseOption: {
            timeline: {
                symbolRotate: '30',
                playInterval: '1000',
                loop: true,
                axisType: 'category',
                autoPlay: true,
                symbol: 'circle',
                checkpointStyle: {
                    color: '#12F6FF',
                    borderColor: '#12F6FF',
                    borderWidth: '1',
                    label: {
                        show: false,
                        textStyle: {
                            color: 'auto'
                        }
                    }
                },
                controlStyle: {
                    itemSize: 25,
                    itemGap: 5,
                    normal: {
                        color: '#fff'
                    },
                    emphasis: {
                        color: '#12F6FF'
                    }
                },
                data: timelineData
            },
            tooltip: {},
            legend: {
                data: legendData
            },
            series: [{
                type: 'pie',
                roseType: 'area'
            }]
        },
        options: options
    };
    return pieOption;
}