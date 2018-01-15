import allColors from './colors';

const colors = allColors.colors;

export default function getLineOption(data) {
    const offset = 60;
    const legendData = [];
    const series = [];
    const yAxis = [];

    Array.isArray(data) && data.forEach((item, index) => {
        legendData.push(item.name);
        series.push({
            name: item.name,
            type: item.displayType || 'line',
            yAxisIndex: index,
            data: item.data,
            smooth: true,
            showSymbol: false,
            itemStyle: {
                normal: {
                    color: colors[index]
                }
            }
        });
        if (index % 2 === 0) { // 奇数放右边
            yAxis.push({
                type: 'value',
                position: 'left',
                offset: Math.floor(index / 2) * offset,
                axisLine: {
                    lineStyle: {
                        color: colors[index]
                    }
                }
            });
        } else { // 偶数放左边
            yAxis.push({
                type: 'value',
                position: 'right',
                offset: Math.floor(index / 2) * offset,
                axisLine: {
                    lineStyle: {
                        color: colors[index]
                    }
                }
            });
        }
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
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: function (value) {
                    const date = new Date(value);
                    const texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()];
                    return texts.join('-');
                }
            }
        }],
        yAxis: yAxis,
        series: series
    };
}