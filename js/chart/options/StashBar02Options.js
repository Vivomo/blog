/**
 * 多层柱状图
 */
import colors from './colors';
import chartUtil from './chartUtil';

export default function getStashBarOption(data) {
    const sortedData = chartUtil.mergeData(data.map(item => item.data));
    const xData = sortedData.map(item => item[0]);

    const legendData = [];
    const dataTotal = chartUtil.getSumArr(sortedData.map(item => item[1]));
    const series = data.map((item, index) => {
        legendData.push(item.name);
        return {
            name: item.name,
            type: 'bar',
            stack: '总量',
            barMaxWidth: 35,
            barGap: '5%',
            itemStyle: {
                normal: {
                    color: colors[index]
                }
            },
            data: sortedData.map(item2 => item2[1][index])
        };
    });
    series.push({
        name: '总量',
        type: 'line',
        stack: '总量',
        data: dataTotal,
        label: {
            normal: {
                show: true,
                position: 'insideTop',
                offset: [0, -30],
                textStyle: {
                    color: '#666',
                }
            }
        },
        symbolSize: 8,
        itemStyle: {
            normal: {
                barBorderRadius: 0,
                label: {
                    show: false,
                    position: 'top',
                    formatter: function (p) {
                        return p.value > 0 ? (p.value) : '';
                    }
                }
            }
        },
        lineStyle: {
            normal: {
                color: '#01B3D7',
                width: 1,
            }
        }
    });
    return {
        animationDurationUpdate: 0,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: true,
            borderWidth: 0,
            top: 110,
            bottom: 95
        },
        legend: {
            textStyle: {
                color: '#90979c',
            },
            data: legendData
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            // axisLabel: {
            //     interval: 0,
            //     rotate: -20
            // },
            data: xData
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            }
        }],
        dataZoom: [{
            show: true,
            height: 30,
            bottom: 10,
            start: 75,
            end: 80,
            throttle: 0,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
                color: '#d3dee5'
            },
            borderColor: '#90979c'
        }],
        series: series
    };
}