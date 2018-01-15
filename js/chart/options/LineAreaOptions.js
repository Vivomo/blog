import colors from './colors';
import chartUtil from './chartUtil';

export default function getLineOption(data) {
    const sortedData = chartUtil.mergeData(data.map(item => item.data));
    const xAxisData = sortedData.map(item => item[0]);

    const legendData = [];
    const series = data.map((item, index) => {
        legendData.push(item.name);
        return {
            name: item.name,
            type: 'line',
            stack: '总量',
            data: sortedData.map(item2 => item2[1][index]),
            symbolSize: 8,
            areaStyle: {
                normal: {}
            },
            itemStyle: {
                normal: {
                    color: colors[index]
                }
            }
        };
    });

    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legendData
        },
        dataZoom: {
            show: true,
            start: 70
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLabel: {
                formatter: chartUtil.formatDate
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: series
    };
}