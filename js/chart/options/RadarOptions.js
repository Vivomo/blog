import allColors from './colors';
const color = allColors.colors;
const colorCount = color.length;

export default function getRadarOptions(data) {
    const legend = data.data.map((item, index) => {
        item.itemStyle = {
            color: color[index % colorCount]
        };
        return item.name;
    });
    return {
        title: {
            text: data.title || ''
        },
        tooltip: {},
        legend: {
            data: legend
        },
        radar: {
            indicator: data.indicator
        },
        series: [{
            name: data.title,
            type: 'radar',
            data: data.data
        }]
    };
}