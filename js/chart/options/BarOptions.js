import allColors from './colors';
import chartUtil from './chartUtil';

export default function getBarOption(data) {
    const legendData = [];
    const series = [];
    const sortedData = chartUtil.mergeData(data.map(item => item.data));
    const xData = sortedData.map(item => item[0]);

    data.forEach((item, index) => {
        legendData.push(item.name);
        series.push({
            name: item.name,
            type: item.displayType || 'bar',
            yAxisIndex: index,
            data: item.data,
            barMaxWidth: 35,
            itemStyle: {
                normal: {
                    color: allColors.colors[index]
                }
            }
        });
    });
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'cross' | 'shadow'
            }
        },
        legend: {
            top: '20px',
            data: legendData
        },
        grid: { // 控制柱状图的位置
            left: '3%',
            right: '3%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
            data: xData,
            type: 'category',
            // boundaryGap: false,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                formatter: chartUtil.formatDate
            }
        }],
        yAxis: chartUtil.getYAxis(data.length),
        dataZoom: [{
            type: 'slider',
            start: 70
        }],
        series: series
    };
}