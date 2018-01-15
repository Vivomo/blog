/**
 * Excel 时间在列, 可视化在X轴, 南华觉得奇怪, 所以这里的  xAxis, yAxis 赋值时对调了
 */
export default function getGraphOptions(obj) {
    let { data } = obj;
    const { xAxis, yAxis } = obj;
    data = data.map((item) => {
        return [item[1], item[0], item[2] || '-'];
    });

    const max = Math.max(Math.abs(obj.min), Math.abs(obj.max));

    return {
        tooltip: {
            position: 'top'
        },
        animation: false,
        grid: {
            height: '50%',
            y: '10%'
        },
        xAxis: {
            type: 'category',
            data: yAxis,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: xAxis,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: -max,
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
                color: ['#00ff00', '#3eff3a', '#7aff73', '#b4ffaf', '#d9ffd6', '#ffffff', '#fee090', '#fdae61', '#f46d43',
                    '#d73027', '#a50026']
            }
        },
        textStyle: {
            color: '#666'
        },
        series: [{
            name: '',
            type: 'heatmap',
            data: data,
            label: {
                normal: {
                    show: true
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
};