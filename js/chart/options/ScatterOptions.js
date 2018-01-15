export default function getScatterOption(data) {
    const legendData = [];
    const series = [];
    data && data.map((item) => {
        legendData.push(item.name);
        const obj = {
            name: item.name,
            data: item.data,
            type: 'scatter'
        };
        series.push(obj);
    });
    return {
        grid: {
            left: '3%',
            right: '7%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            showDelay: 0,
            formatter: function (params) {
                return `${params.name} :<br/> ${params.value[0]} / ${params.value[1]}`;
            },
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                    type: 'dashed',
                    width: 1
                }
            }
        },
        legend: {
            data: legendData,
            left: 'center'
        },
        xAxis: [{
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        }],
        series: series
    };
}