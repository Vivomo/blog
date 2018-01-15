/* eslint-disable import/no-dynamic-require */
import D3Proxy from './D3Proxy';

const CHART_TYPE = {
    BAR: 'BAR',
    MAP: 'MAP',
    SCATTER: 'SCATTER',
    CANDLESTICK: 'CANDLESTICK',
    LINE: 'LINE',
    STASH_BAR_01: 'STASH_BAR_01',
    STASH_BAR_02: 'STASH_BAR_02',
    STASH_BAR_03: 'STASH_BAR_03',
    HORIZONTAL_BAR: 'HORIZONTAL_BAR',
    LINE_AREA: 'LINE_AREA',
    PIE: 'PIE',
    ROSE_PIE: 'ROSE_PIE',
    NEST_PIE: 'NEST_PIE',
    SANKEY: 'SANKEY',
    RADAR: 'RADAR',
    HEATMAP: 'HEATMAP',
    EDGE_BUNDLE: 'EDGE_BUNDLE',
    KNOWLEDGE_TOPOLOGY: 'KNOWLEDGE_TOPOLOGY', // 知识图谱, 力向图
    BUBBLE: 'BUBBLE',
    RADIAL_TIDY_TREE: 'RADIAL_TIDY_TREE',
    DENDROGRAM: 'DENDROGRAM',
    SUNBURST: 'SUNBURST',
    TABLE: 'TABLE'
};

const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/geo');
require('echarts/lib/component/dataZoom');
require('echarts/lib/component/timeline');

export const ECHARTS_OPTION_MAP = {
    [CHART_TYPE.MAP]: 'MapOptions',
    [CHART_TYPE.SCATTER]: 'ScatterOptions',
    [CHART_TYPE.CANDLESTICK]: 'CandlestickOptions',
    [CHART_TYPE.LINE]: 'LineOptions',
    [CHART_TYPE.STASH_BAR_01]: 'StashBar01Options',
    [CHART_TYPE.STASH_BAR_02]: 'StashBar02Options',
    [CHART_TYPE.STASH_BAR_03]: 'StashBar03Options',
    [CHART_TYPE.HORIZONTAL_BAR]: 'HorizontalBarOptions',
    [CHART_TYPE.LINE_AREA]: 'LineAreaOptions',
    [CHART_TYPE.PIE]: 'PieOptions',
    [CHART_TYPE.ROSE_PIE]: 'RosePieOptions',
    [CHART_TYPE.NEST_PIE]: 'NestPieOptions',
    [CHART_TYPE.BAR]: 'BarOptions',
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
        this.type = this.type || CHART_TYPE.LINE;
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
            this.drawEchart();
        }
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
            case CHART_TYPE.MAP:
                require('echarts/lib/chart/map');
                require('echarts/map/js/china');
                break;

            case CHART_TYPE.SCATTER:
                // 散点 & 气泡
                require('echarts/lib/chart/scatter');
                break;

            case CHART_TYPE.CANDLESTICK:
                require('echarts/lib/chart/candlestick');
                break;

            case CHART_TYPE.LINE:
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

            case CHART_TYPE.BAR:
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

    dispose = () => {
        if (this.chart) {
            echarts.dispose(this.elem);
        } else {
            D3Proxy.dispose(this.elem);
        }
    }
}
