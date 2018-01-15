/* eslint-disable import/no-dynamic-require */
import jsplumb from 'jsplumb';
import D3Proxy from '../D3/D3Proxy';
import {
    CHART_TYPE
} from '../../redux/constant';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/geo');
require('echarts/lib/component/dataZoom');
require('echarts/lib/component/timeline');

export const ECHARTS_OPTION_MAP = {
    [CHART_TYPE.map]: 'MapOptions',
    [CHART_TYPE.scatter]: 'ScatterOptions',
    [CHART_TYPE.candlestick]: 'CandlestickOptions',
    [CHART_TYPE.line]: 'LineOptions',
    [CHART_TYPE.STASH_BAR_01]: 'StashBar01Options',
    [CHART_TYPE.STASH_BAR_02]: 'StashBar02Options',
    [CHART_TYPE.STASH_BAR_03]: 'StashBar03Options',
    [CHART_TYPE.HORIZONTAL_BAR]: 'HorizontalBarOptions',
    [CHART_TYPE.LINE_AREA]: 'LineAreaOptions',
    [CHART_TYPE.PIE]: 'PieOptions',
    [CHART_TYPE.ROSE_PIE]: 'RosePieOptions',
    [CHART_TYPE.NEST_PIE]: 'NestPieOptions',
    [CHART_TYPE.bar]: 'BarOptions',
    [CHART_TYPE.EDGE_BUNDLE]: 'EdgeBundleOptions',
    [CHART_TYPE.KNOWLEDGE_TOPOLOGY]: 'KnowledgeTopologyOptions',
    [CHART_TYPE.HEATMAP]: 'HeatmapOptions',
    [CHART_TYPE.RADAR]: 'RadarOptions',
    [CHART_TYPE.BUBBLE]: 'BubbleOptions',
};

export default class Painter {

    /**
     *
     * @param cfg {object} 里面有data(绘图的数据),
     *                     type(图标类型),
     *                     elem被绘制的元素(DOM元素或一个被document.querySelector支持的选择器),
     *                     async 是否需要手动调用 draw 方法
     *                     option {
     *                        name 指定自定义的option,
     *                        callback 对option处理的回调函数
     *                     }
     *                     optionConfig {
     *                        ... 属性值设为false 则在option中删除此属性, 否则为添加或覆盖属性
     *                     },
     *                     action { 给echart 绑定事件
     *                        ... key 为事件名, value 为callback
     *                     }
     */
    constructor(cfg) {
        Object.assign(this, cfg);
        this.chart = null;
        this.type = this.type || CHART_TYPE.line;
        this.optionConfig = this.optionConfig || {};
        this.option = this.option || {};
        if (typeof this.elem === 'string') {
            this.elem = document.querySelector(this.elem);
        }
        if (!this.async) {
            this.draw();
        }
    }

    static isD3Type = (type) => {
        return [CHART_TYPE.DENDROGRAM, CHART_TYPE.RADIAL_TIDY_TREE, CHART_TYPE.SUNBURST, CHART_TYPE.SANKEY].includes(type);
    }

    /**
     * 绘制方法
     */
    draw = () => {
        const { elem, data, type } = this;
        if (Painter.isD3Type(type)) {
            this.drawD3(type, data, elem);
        } else {
            if (type === CHART_TYPE.TABLE) {
                this.drawTable(data, elem);
            } else {
                this.drawEchart();
            }
        }
    }

    static connectionStyle = {
        strokeWidth: 2,
        stroke: '#5c96bc',
        outlineStroke: 'transparent',
        outlineWidth: 2
    }
    /**
     *
     * @param wrapper DOM Element or selector
     */
    static getConnector = (wrapper) => {
        const instance = jsplumb.jsPlumb.getInstance({
            Endpoint: ['Dot', {
                radius: 2
            }],
            Connector: 'StateMachine',
            // 控制连线的颜色和粗细
            PaintStyle: Painter.connectionStyle,
            ConnectionOverlays: [
                ['Arrow', {
                    location: 1,
                    id: 'arrow',
                    length: 12,
                    foldback: 0.8,
                    paintStyle: {}
                }],
            ],
            Container: wrapper
        });
        instance.registerConnectionType('basic', {
            anchor: 'Continuous',
            connector: 'StateMachine'
        });
        return instance;
    }

    /**
     * @param data {Array} 数据结构为：[{ time, [{ name, value }] }]
     * @param elem {} 容器，data数据生成的table将被放到该容器中
     * @memberof Painter
     */
    drawTable = (data, elem) => {
        const headers = ['日期'];
        const rowDatas = [];
        
        const firstRowData = data[0].data;
        firstRowData.forEach(item => headers.push(item.name));
        
        data.forEach((item) => {
            const rowData = [];
            rowData.push(item.time);
            item.data.forEach(ele => rowData.push(ele.value));
            rowDatas.push(rowData);
        });
        
        // 遍历data，生成table
        let table = '<table><thead><tr>';
        // 生成表头
        headers.forEach((header) => {
            table += `<th>${header}</th>`;
        });
        table += '</tr></thead><tbody>';
        // 生成行
        rowDatas.forEach((rowData) => {
            table += '<tr>';
            rowData.forEach((item) => {
                table += `<td>${item}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        elem.innerHTML = table;
    }

    drawD3 = (type, data, elem) => {
        D3Proxy.init(elem);
        switch (type) {
            case CHART_TYPE.RADIAL_TIDY_TREE:
                D3Proxy.drawRadialTidyTree(data, elem);
                break;
            case CHART_TYPE.DENDROGRAM:
                D3Proxy.drawDendrogram(data, elem);
                break;
            case CHART_TYPE.SUNBURST:
                D3Proxy.drawSunburst(data, elem);
                break;
            case CHART_TYPE.SANKEY:
                D3Proxy.drawSankey(data, elem);
                break;
            default:
        }
    }

    drawEchart = (isUpdate = false) => {
        if (!isUpdate) {
            this.chart = echarts.init(this.elem);
        } else {
            this.chart.clear();
        }

        this.requireEchartLib();
        this.chart.setOption(this.getEchartOption());
        this.bindAction();
    }

    /**
     * 绑定echart支持的事件
     */
    bindAction = () => {
        if (this.action) {
            Object.entries(this.action).forEach(([action, callback]) => {
                this.chart.on(action, callback);
            });
        }
    }

    /**
     * 根据图表类型 加载echart lib
     */
    requireEchartLib = () => {
        switch (this.type) {
            case CHART_TYPE.map:
                require('echarts/lib/chart/map');
                require('echarts/map/js/china');
                break;

            case CHART_TYPE.scatter:
                // 散点 & 气泡
                require('echarts/lib/chart/scatter');
                break;

            case CHART_TYPE.candlestick:
                require('echarts/lib/chart/candlestick');
                break;

            case CHART_TYPE.line:
                require('echarts/lib/chart/line');
                break;

            case CHART_TYPE.STASH_BAR_01:
                require('echarts/lib/chart/bar');
                break;

            case CHART_TYPE.STASH_BAR_02:
                require('echarts/lib/chart/bar');
                break;

            case CHART_TYPE.STASH_BAR_03:
                require('echarts/lib/chart/bar');
                break;

            case CHART_TYPE.HORIZONTAL_BAR:
                require('echarts/lib/chart/bar');
                break;

            case CHART_TYPE.LINE_AREA:
                require('echarts/lib/chart/line');
                break;

            case CHART_TYPE.PIE:
                require('echarts/lib/chart/pie');
                break;

            case CHART_TYPE.ROSE_PIE:
                require('echarts/lib/chart/pie');
                break;

            case CHART_TYPE.NEST_PIE:
                require('echarts/lib/chart/pie');
                break;

            case CHART_TYPE.bar:
                require('echarts/lib/chart/bar');
                break;
            case CHART_TYPE.EDGE_BUNDLE:
                // 力引导布局 & edge
                require('echarts/lib/chart/graph');
                break;
            case CHART_TYPE.KNOWLEDGE_TOPOLOGY:
                require('echarts/lib/chart/graph');
                break;
            case CHART_TYPE.HEATMAP:
                require('echarts/lib/component/visualMap');
                require('echarts/lib/chart/heatmap');
                break;
            case CHART_TYPE.RADAR:
                require('echarts/lib/chart/radar');
                break;
            case CHART_TYPE.BUBBLE:
                require('echarts/lib/chart/scatter');
                break;
            default:
            // chart.clear();
        }
    }

    getEchartOption = () => {
        let option = {};
        if (this.option.name) {
            option = require(`../Chart/options/${this.option.name}`)(this.data, this.option.config);
        } else {
            option = require(`../Chart/options/${ECHARTS_OPTION_MAP[this.type]}`)(this.data, this.option.config);
        }
        Object.keys(this.optionConfig).forEach((key) => {
            const value = this.optionConfig[key];
            if (value === false) {
                delete option[key];
            } else {
                option[key] = value;
            }
        });
        if (this.option.callback) {
            this.option.callback(option);
        }
        return option;
    }
    /**
     * 绘制场景的节点
     * @param cfg
     */
    static createSceneNode = (cfg) => {
        const { wrapper, id, className, html, style, data } = cfg;
        const div = document.createElement('div');
        div.id = id;
        div.className = className;
        div.innerHTML = html;
        if (style) {
            Object.assign(div.style, style);
        }
        if (data) {
            Object.assign(div.dataset, data);
        }
        wrapper.appendChild(div);
        return div;
    }

    static drawSceneLines = (wrapper, data, connector) => {
        data.forEach((line) => {
            const { relationFrom, relationTo } = line;
            connector.connect({
                source: relationFrom,
                target: relationTo,
                type: 'basic'
            });
        });
    }

    static drawScene = (wrapper, data) => {
        wrapper.innerHTML = '';
        const { nodeList, nodeRelationList } = data;
        const connector = Painter.getConnector(wrapper);

        nodeList.forEach((node) => {
            const { nodeType, leftMargin, topMargin, nodeId, nodeName,
                inputSequence,
                inputValue,
                outputSequence,
                outputValue,
                ossInfo,
                outputContent } = node;
            Painter.createSceneNode({
                wrapper: wrapper,
                id: nodeId,
                className: nodeType === 'start' ? 'window start-node' : 'window',
                html: `${nodeName} <div class='close'></div><div class='ep'></div><input type='checkbox' value='0' />`,
                style: {
                    left: leftMargin,
                    top: topMargin
                },
                data: {
                    nodeId,
                    nodeType,
                    inputSequence,
                    inputValue,
                    outputSequence,
                    outputValue,
                    ossInfo,
                    outputContent
                }
            });
            // Painter.initSceneNode(div, nodeType, connector);
        });

        Painter.drawSceneLines(wrapper, nodeRelationList, connector);
    }


    /**
     * 为节点初始化一些属性
     * @param {Object} el          要初始化的元素
     * @param {String} nodeType    节点类型
     * @param {Object} connector   连线器
     */
    static initSceneNode = (el, nodeType, connector) => {
        /**
         * 条件判断：
         * 如果新节点是开始节点，那么该节点只能是source，不能是target
         * 如果新节点是工具节点，那么该节点既是source，也是target，连接时需要进行入参校验
         * 如果新节点是结束节点，那么该节点只能是target，不能是source
         */
        switch (nodeType) {
            case 'start':
            case 'constant':
                connector.makeSource(el, {
                    filter: '.ep',
                    anchor: 'Continuous',
                    connectorStyle: Painter.connectionStyle
                });
                break;
            default:
                connector.makeSource(el, {
                    filter: '.ep',
                    anchor: 'Continuous',
                    connectorStyle: Painter.connectionStyle
                });
                connector.makeTarget(el, {
                    dropOptions: {
                        hoverClass: 'dragHover'
                    },
                    anchor: 'Continuous',
                    allowLoopback: false
                });
        }
    };

    dispose = () => {
        if (this.chart) {
            echarts.dispose(this.elem);
        } else {
            D3Proxy.dispose(this.elem);
        }
    }
}
