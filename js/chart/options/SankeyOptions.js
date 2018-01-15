/**
 * 已废弃 - 由 D3 绘制 Sankey
 *
 * data 的数据结构
 * {
 * "nodes":[{"name":"string"}...],
 * "links":[{"source":"string", "target":"string", "value":number}...]
 * }
 */
export default function getSankeyOptions(data) {
    return {
        title: {
            text: 'Sankey Diagram'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                layout: 'none',
                data: data.nodes,
                links: data.links,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }
        ]
    };
};
