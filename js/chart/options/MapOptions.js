import colors from './colors';

export default function getMapOption(data) {
    // 引入timeline的时候有一个新属性baseOption。在实现timeline时会用options中的每个option去merge baseOption
    const mapOption = {
        baseOption: { // timeline需要的baseOption
            // 时间轴的配置项
            timeline: {
                axisType: 'category',   // 类目轴，适用于离散的类目数据
                orient: 'horizontal',   // 摆放方式，有水平和竖直两种
                autoPlay: true,         // 自动播放
                inverse: false,          // 是否反向放置 timeline，反向则首位颠倒过来
                playInterval: 3000,     // 播放速度
                label: {                // 时间轴的文本标签
                    normal: {           // 普通状态下
                        textStyle: {    // 文本标签的文字样式
                            color: '#333333'
                        }
                    }
                },
                bottom: '20',
                symbol: 'circle',          // timeline标记的图形
                lineStyle: {            // 时间轴线样式
                    color: '#555'       // 线的颜色
                },
                checkpointStyle: {      // 当前项的图形样式。
                    color: '#bbb',      // 当前项的颜色
                    borderColor: '#777', // 当前项的边框颜色
                    borderWidth: 1      // 当前项的边框宽度
                },
                controlStyle: {         // 控制按钮的样式
                    showNextBtn: false, // 是否显示『后退按钮』
                    showPrevBtn: false, // 是否显示『前进按钮』
                    normal: {           // 控制按钮的『正常状态』的样式
                        color: '#666',
                        borderColor: '#666'
                    }
                },
                data: data.map((ele) => { // timeline 数据。Array 的每一项
                    return {
                        value: ele.time,
                        tooltip: {
                            formatter: function (params) {
                                return params.name;
                            }
                        }
                    };
                })
            },
            // 其他配置项
            backgroundColor: '#f5f5f5',     // 地图的背景色
            tooltip: {                      // 提示框
                formatter: function (params) {
                    if (params.data && params.data.value) {
                        return `${params.data.name}: ${params.data.value[0]}`;
                    }
                }
            },
            grid: {                         // 直角坐标系内绘图网格
                show: false,
                left: 10,
                right: '45%',
                top: '70%',
                bottom: 5
            },
            xAxis: {                        // 横坐标
                show: false
            },
            yAxis: {                        // 纵坐标
                show: false
            }
        },
        options: [] // 其他的变量，会去merge baseOption
    };

    for (let i = 0; i < data.length; i++) {
        const mapData = data[i].data;
        const pieces = [];

        mapData.map((data, index) => {
            const value = Array.isArray(data.value) ? data.value[0] : data.value;
            pieces.push({
                value: index,
                color: colors[index]
            });
            return Object.assign(data, {
                name: data.name,
                value: [value, index]
            });
        });

        mapOption.options.push({ // 每个数据单独对应一个option
            visualMap: {               // 视觉映射组件
                type: 'piecewise',
                dimension: 1,
                pieces: pieces,
                formatter: function (value) {
                    return `${mapData[value].name} : ${mapData[value].value[0]}`;
                },
                right: 10,
                top: 'center'
            },
            series: [{
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: mapData
            }]
        });
    }
    return mapOption;
}