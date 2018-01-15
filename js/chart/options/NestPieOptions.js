/**
 * 嵌套环形图
 */
export default function getNestPieOption(data) {
    let startRadius = 0;
    let endRadius = 0;
    const endRadiusOffset = 22;
    const legendData = [];
    const series = [];
    data.length > 0 && data.forEach((item, index) => { // item为一个数组
        startRadius = index === 0 ? 0 : endRadius + 5;
        endRadius = index === 0 ? endRadiusOffset : endRadiusOffset * (index + 1);
        series.push({
            type: 'pie',
            selectedMode: 'single',
            label: {
                normal: {
                    show: true,
                    position: 'inner',
                    formatter: '{b}: {c}'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: item,
            radius: [`${startRadius}%`, `${endRadius}%`]
        });
        item.forEach((ele) => {
            if (legendData.indexOf(ele.name) === -1) {
                legendData.push(ele.name);
            }
        });
    });
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legendData
        },
        series: series
    };
}