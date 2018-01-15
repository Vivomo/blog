import allColors from './colors';
const color = allColors.colors;
const colorCount = color.length;

export default function getGraphOptions(data) {
    const categories = data.categories;

    // data.nodes = edgeBundle.nodes;

    data.nodes.forEach((node, index) => {
        node.itemStyle = {
            color: color[index % colorCount]
        };
        node.value = Number(node.value);
        node.category = Number(node.category);
        // node.value = node.symbolSize;
        node.label = {
            normal: {
                show: true
            }
        };
        node.symbolSize = node.value;
        node.attributes = {
            modularity_class: node.category
        };
    });


    return {
        title: {
            text: '',
            subtext: '',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            data: categories.map((c) => {
                return c.name;
            })
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: data.title || '',
                type: 'graph',
                layout: 'circular',
                circular: {
                    rotateLabel: true
                },
                data: data.nodes,
                links: data.links,
                categories: categories,
                roam: true,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.3
                    }
                }
            }
        ]
    };
}