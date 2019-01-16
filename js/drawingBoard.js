function DrawingBoard(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    // 操作历史
    this.history = [];
    this.command = {};
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

let canvasRenderingContext2DPrototype = CanvasRenderingContext2D.prototype;
if (!canvasRenderingContext2DPrototype.ellipse) {
    canvasRenderingContext2DPrototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        this.restore();
    };
}


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
        exe: function (e) {
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
        exe: function () {
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
        exe: function () {
            this.recordHistory();
            this.backCtx.clearRect(0, 0, this.width, this.height);
        }
    },
    /**
     * 设置上下文
     */
    setCtx: {
        type: CMD_TYPE.once,
        exe: function (key, value) {
            this.foreCtx[key] = value;
        }
    },
    /**
     * 橡皮擦
     */
    eraser: {
        type: CMD_TYPE.move,
        exe: function (e) {
            let {clientX, clientY} = getMainEvent(e);
            let {canvasOffsetX, canvasOffsetY, backCtx, eraserRadius} = this;
            backCtx.clearRect(clientX - canvasOffsetX, clientY - canvasOffsetY, eraserRadius, eraserRadius);
        }
    },
    /**
     * 设置画板
     */
    setDrawingBoard: {
        type: CMD_TYPE.once,
        exe: function (key, value) {
            this[key] = value
        }
    },
    /**
     * 画形状
     */
    shape: {
        type: CMD_TYPE.move,
        exe: function (e) {
            let {clientX, clientY} = getMainEvent(e);
            let {canvasOffsetX, canvasOffsetY, foreCtx, width, height, startX, startY} = this;
            let diffX = clientX - canvasOffsetX;
            let diffY = clientY - canvasOffsetY;
            foreCtx.beginPath();
            foreCtx.clearRect(0, 0, width, height);
            switch (this.shape) {
                case 'line':
                    foreCtx.moveTo(startX, startY);
                    foreCtx.lineTo(diffX, diffY);
                    break;
                case 'rect':
                    foreCtx.strokeRect(startX, startY, diffX - startX, diffY - startY);
                    break;
                case 'circle':
                    foreCtx.ellipse((startX + diffX) / 2, (startY + diffY) / 2, Math.abs(diffX - startX) / 2, Math.abs(diffY - startY) / 2, 0, 0, Math.PI * 2);
                    break;
            }
            foreCtx.stroke();
        }
    }
};

DrawingBoard.prototype = {
    constructor: DrawingBoard,
    defaultCfg: {
        // 历史记录最大保存次数
        maxHistorySize: 20
    },
    eraserRadius: 10,
    shape: 'line',
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
        this.foreCtx.lineWidth = 2;
    },
    /**
     * 初始化背景canvas
     */
    initBackground: function() {
        this.background = this.cfg.wrap.querySelector('.background');
        this.backCtx = this.background.getContext('2d');
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
     * @param elem
     */
    bindCommand: function(elem) {
        let cmd = getDomData(elem, 'cmd');
        let key = getDomData(elem, 'key');
        let value = getDomData(elem, 'value');
        let command = this.commands[cmd];
        if (!command) {
            return;
        }
        if (command.type === CMD_TYPE.once) {
            command.exe.call(this, key, value);
        } else {
            this.command = {
                type: command.type,
                exe: command.exe.bind(this)
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
                this.startX = clientX - canvasOffsetX;
                this.startY = clientY- canvasOffsetY;
                foreCtx.beginPath();
                foreCtx.moveTo(this.startX, this.startY);
                canvas.addEventListener('mousemove', this.command.exe)
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('mousemove', this.command.exe);
                this.recordHistory();
                this.addForeToBack();
            }
        });

        canvas.addEventListener('touchstart', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                foreCtx.beginPath();
                let {clientX, clientY} = e.touches[0];
                foreCtx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
                canvas.addEventListener('touchmove', this.command.exe);
            }
        });

        canvas.addEventListener('touchend', () => {
            if (this.command.type === CMD_TYPE.move) {
                canvas.removeEventListener('touchmove', this.command.exe);
                this.recordHistory();
                this.addForeToBack();
            }
        });
    },
    /**
     * 工具列表事件绑定
     */
    initUtilsEvent: function() {
        let utilsWrap = this.cfg.wrap.querySelector('.utils-list');
        let utilsElem = utilsWrap.querySelectorAll('[data-cmd]');
        let me = this;
        for (let i = 0, l = utilsElem.length; i < l; i++) {
            utilsElem[i].addEventListener('click', function(e){
                if (hasClass(this, 'sub-cmd')) {
                    removeClass(this.parentElement.parentElement, 'show');
                    e.stopPropagation();
                } else {
                    let activeElem = utilsWrap.querySelector('.cmd-item.active');
                    if (!hasClass(this, 'once')) {
                        if (hasClass(this, 'menu')) {
                            if (this === activeElem) {
                                toggleClass(this, 'show');
                            } else {
                                activeElem && removeClass(activeElem, 'active');
                                addClass(this, 'show');
                            }
                        } else {
                            activeElem && removeClass(activeElem, 'active');
                            activeElem && removeClass(activeElem, 'show');
                        }
                        addClass(this, 'active');
                    }
                    if (hasClass(this, 'menu')) {
                        addClass(this, 'show');
                    }
                }

                me.bindCommand(this);
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
