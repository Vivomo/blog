/**
 * 堆叠柱状图1
 */
import colors from './colors';
import chartUtil from './chartUtil';

export default function getStashBarOption(data) {
    const sortedData = chartUtil.mergeData(data.map(item => item.data));
    const yData = sortedData.map(item => item[0]);

    const legendData = [];
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
            type: 'value',
            boundaryGap: [0, 0.01]
        }],
        yAxis: [{
            type: 'category',
            data: yData
        }],
        dataZoom: [{
            show: true,
            start: 75,
            // end: 80,
            throttle: 0,
            left: 20,
            orient: 'vertical',
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