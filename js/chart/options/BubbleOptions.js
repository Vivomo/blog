const echarts = require('echarts/lib/echarts');

export default function getBubbleOptions(data) {
    const legend = data.data.map((item) => {
        return item[0][4];
    });
    const color = [
        { one: 'rgb(251, 118, 123)', two: 'rgb(204, 46, 72)' },
        { one: 'rgb(129, 227, 238)', two: 'rgb(25, 183, 207)' },
        { one: 'rgb(61, 222, 154)', two: 'rgb(34, 167, 111)' },
        { one: 'rgb(151, 188, 255)', two: 'rgb(66, 132, 254)' },
        { one: 'rgb(255, 158, 120)', two: 'rgb(237, 86, 40)' },
    ];
    let colorOne, 
        colorTwo;
    const series = data.data.map((d, i) => {
        if (i % 2 === 0) {
            colorOne = color[1].one;
            colorTwo = color[1].two;
        } else if (i % 3 === 0) {
            colorOne = color[2].one;
            colorTwo = color[2].two;
        } else if (i % 5 === 0) {
            colorOne = color[3].one;
            colorTwo = color[3].two;
        } else if (i % 7 === 0) {
            colorOne = color[4].one;
            colorTwo = color[5].two;
        } else {
            colorOne = color[0].one;
            colorTwo = color[0].two;
        }
        return {
            name: d[0][4],
            data: d,
            type: 'scatter',
            symbolSize: function (data) {
                return Math.sqrt(data[2]) / 5e2;
            },
            label: {
                emphasis: {
                    show: true,
                    formatter: function (param) {
                        return param.data[3];
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                        offset: 0,
                        color: colorOne
                    }, {
                        offset: 1,
                        color: colorTwo
                    }])
                }
            }
        };
    });
    return {
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#fff'
        }, {
            offset: 1,
            color: '#fff'
        }]),
        title: {
            text: data.title || ''
        },
        legend: {
            right: 10,
            data: legend
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: series
    };
}