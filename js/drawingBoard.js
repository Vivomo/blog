function DrawingBoard(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    // 操作历史
    this.history = [];
    this.init();
}
let body = document.body;

let supportClassList = !!body.classList;

let getDomData = body.dataset ? (dom, dataName) => dom.dataset[dataName] : (dom, dataName) => dom.getAttribute('data-' + dataName);

let getMainEvent = (arg) => arg.clientX === undefined ? arg.touches[0] : arg;

let removeClass = supportClassList ? (dom, className) => {
    dom.classList.remove(className);
    return dom;
} : (dom, className) => {
    let classList = dom.className.split(' ');
    let index = classList.indexOf(className);
    if (index !== -1) {
        classList[index] = '';
        dom.className = classList.join(' ');
    }
    return dom;
};

let addClass = supportClassList ? (dom, className) => {
        dom.classList.add(className);
        return dom;
    } : (dom, className) => {
        if (!hasClass(dom, className)) {
            dom.className += ' ' + className;
        }
        return dom;
    };

let hasClass = supportClassList ?
    (dom, className) => dom.classList.contains(className) : (dom, className) => dom.className.split(' ').includes(className);

let toggleClass = (dom, className) => hasClass(dom, className) ? removeClass(dom, className) : addClass(dom, className);

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
            let {canvasOffsetX, canvasOffsetY, foreCtx} = this;
            foreCtx.lineTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
            foreCtx.stroke();
        }
    },
    /**
     * 上一步
     */
    back: {
        type: CMD_TYPE.once,
        func: function () {
            let {backCtx, history} = this;
            if (history.length > 0) {
                backCtx.putImageData(history.pop(), 0, 0);
            }
        }
    },
    /**
     * 清空画板
     */
    clear: {
        type: CMD_TYPE.once,
        func: function () {
            this.recordHistory();
            this.backCtx.clearRect(0, 0, this.width, this.height);
        }
    }
};

DrawingBoard.prototype = {
    constructor: DrawingBoard,
    defaultCfg: {
        // 历史记录最大保存次数
        maxHistorySize: 20
    },
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
        this.foreCtx = this.foreground.getContext('2d');
        let {left, top} = this.foreground.getBoundingClientRect();
        this.canvasOffsetX = left;
        this.canvasOffsetY = top;
        this.foreCtx.lineCap = 'round';
        this.foreCtx.lineWidth = 3;

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
    /**
     * 绑定指令
     * @param cmd
     */
    bindCommand: function(cmd) {
        let command = this.commands[cmd];
        if (command.type === CMD_TYPE.once) {
            command.func.call(this);
        } else {
            this.command = {
                type: command.type,
                func: command.func.bind(this)
            }
        }
    },
    /**
     * 前景canvas事件绑定
     */
    initForegroundEvent: function () {
        let canvas = this.foreground;
        let foreCtx = this.foreCtx;
        let {canvasOffsetX, canvasOffsetY} = this;

        canvas.addEventListener('mousedown', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                let {clientX, clientY} = e;
                foreCtx.beginPath();
                foreCtx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
                canvas.addEventListener('mousemove', this.command.func)
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('mousemove', this.command.func);
                this.recordHistory();
                this.addForeToBack();
            }
        });

        canvas.addEventListener('touchstart', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                foreCtx.beginPath();
                let {clientX, clientY} = e.touches[0];
                foreCtx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
                canvas.addEventListener('touchmove', this.command.func);
            }
        });

        canvas.addEventListener('touchend', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('touchmove', this.command.func);
                this.recordHistory();
                this.addForeToBack();
            }
        });
    },
    /**
     * 工具列表事件绑定
     */
    initUtilsEvent: function() {
        let utilsElem = this.cfg.wrap.querySelectorAll('.utils-list .cmd-item');
        let activeUtil = null;
        for (let i = 0, l = utilsElem.length; i < l; i++) {
            utilsElem[i].addEventListener('click', (e) => {
                if (activeUtil) {
                    removeClass(activeUtil, 'active');
                }
                activeUtil = e.target;
                activeUtil.className += ' active';
                this.bindCommand(getDomData(activeUtil, 'cmd'));
            });
        }
    },
    /**
     * 记录历史
     * 超出最大记录长度时, 则把第一个删掉
     */
    recordHistory: function () {
        this.history.push(this.backCtx.getImageData(0, 0, this.width, this.height));
        if (this.history.length > this.cfg.maxHistorySize) {
            this.history.shift();
        }
    },
    /**
     * 前景叠加到背景
     */
    addForeToBack: function () {
        this.backCtx.drawImage(this.foreground, 0, 0);
        this.foreCtx.clearRect(0, 0, this.width, this.height);
    }
};
