import allColors from './colors';
const color = allColors.colors;
const colorCount = color.length;

export default function getKnowledgeTopologyOptions(data) {
    const categories = data.categories;

    data.nodes.forEach((node, index) => {
        node.category = Number(node.category);
        node.itemStyle = {
            color: color[index % colorCount]
        };
        node.symbolSize = 10;
        // node.value = node.symbolSize;
        node.attributes = {
            modularity_class: node.category
        };
        // Use random x, y
        node.draggable = true;
    });
    return {
        title: {
            text: data.title || '',
            subtext: '',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: categories.map((c) => {
                return c.name;
            })
        }],
        animation: false,
        series: [
            {
                name: data.title,
                type: 'graph',
                layout: 'force',
                data: data.nodes,
                links: data.links,
                categories: categories,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        position: 'right'
                    }
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    };
}