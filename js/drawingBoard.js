function DrawingBoard(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    this.init();
}
let body = document.body;

let getDomData = body.dataset ? (dom, dataName) => dom.dataset[dataName] : (dom, dataName) => dom.getAttribute('data-' + dataName);

let getMainEvent = (arg) => arg.clientX === undefined ? arg.touches[0] : arg;

let removeClass = body.classList ? (dom, className) => {
    dom.classList.remove(className);
} : (dom, className) => {
    let classList = dom.className.split(' ');
    let index = classList.indexOf(className);
    if (index !== -1) {
        classList[index] = '';
        dom.className = classList.join(' ');
    }
};

const CMD_TYPE = {
    move: 'move',
    once: 'once'
};

/**
 * 画板指令列表
 */
const commands = {
    /**
     * 画笔指令
     * @param e
     */
    draw: {
        type: CMD_TYPE.move,
        func: function (e) {
            let {clientX, clientY} = getMainEvent(e);
            let {canvasOffsetX, canvasOffsetY, ctx} = this;
            ctx.lineCap = 'round';
            ctx.lineTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
            ctx.stroke();
        }
    },

};

DrawingBoard.prototype = {
    constructor: DrawingBoard,
    defaultCfg: {
        // 历史记录最大保存次数
        maxHistorySize: 20
    },
    // 操作历史
    history: [],
    /**
     * 初始化
     * html初始化
     * canvas初始化
     * 事件初始化
     */
    init: function() {
        this.initHtml();
        this.initCanvas();
        this.initEvent();
    },
    /**
     * 初始化html
     */
    initHtml: function() {
    },
    /**
     * 初始化canvas, 前景和背景
     */
    initCanvas: function() {
        this.initForeground();
        this.initBackground();
    },
    /**
     * 初始化前景canvas
     */
    initForeground: function() {
        this.foreground = this.cfg.wrap.querySelector('.foreground');
        this.width = this.foreground.width;
        this.height = this.foreground.height;
        this.ctx = this.foreground.getContext('2d');
        let {left, top} = this.foreground.getBoundingClientRect();
        this.canvasOffsetX = left;
        this.canvasOffsetY = top;
        this.bindCommand('draw');
    },
    /**
     * 初始化背景canvas
     */
    initBackground: function() {
        this.background = this.cfg.wrap.querySelector('.background');
        this.backCtx = this.background.getContext('2d');
        this.backCtx.globalCompositeOperation = 'lighter';
    },
    /**
     * 初始化绑定事件
     */
    initEvent: function() {
        this.initUtilsEvent();
        this.initForegroundEvent();
    },
    /**
     * 画板指令列表
     */
    commands,
    // 获取指令
    getCommand: function(utilElem) {
        let command = getDomData(utilElem, 'cmd');
    },
    /**
     * 绑定指令
     * @param cmd
     */
    bindCommand: function(cmd) {
        let command = this.commands[cmd];
        this.command = {
            type: command.type,
            func: command.func.bind(this)
        }
    },
    /**
     * 前景canvas事件绑定
     */
    initForegroundEvent: function () {
        let canvas = this.foreground;
        let ctx = this.ctx;
        let {canvasOffsetX, canvasOffsetY} = this;

        canvas.addEventListener('mousedown', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                let {clientX, clientY} = e;
                ctx.beginPath();
                ctx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
                canvas.addEventListener('mousemove', this.command.func)
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('mousemove', this.command);
                this.updateHistory();
            }
        });

        canvas.addEventListener('touchstart', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                ctx.beginPath();
                let {clientX, clientY} = e.touches[0];
                ctx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
                canvas.addEventListener('touchmove', this.command);
            }
        });

        canvas.addEventListener('touchend', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('touchmove', this.command)
                this.updateHistory();
            }
        });
    },
    /**
     * 工具列表事件绑定
     */
    initUtilsEvent: function() {
        let utilsElem = this.cfg.wrap.querySelector('.utils-list .cmd-item');
        let activeUtil = null;
        for (let i = 0, l = utilsElem.length; i < l; i++) {
            utilsElem[i].addEventListener('click', (e) => {
                if (activeUtil) {
                    removeClass(activeUtil, 'active');
                }
                activeUtil = e.target;
                activeUtil.className += ' active';
            });
        }
    },
    /**
     * 更新历史
     */
    updateHistory: function () {
        this.backCtx.drawImage(this.foreground, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.history.push(this.backCtx.getImageData(0, 0, this.width, this.height));
        if (this.history.length > this.cfg.maxHistorySize) {
            this.history.unshift();
        }
    }
};
