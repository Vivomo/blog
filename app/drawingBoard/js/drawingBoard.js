import {
    getDomData,
    removeClass,
    addClass,
    hasClass,
    toggleClass,
    CMD_TYPE
} from './drawingBoardUtil.js'

import commands from './commands.js';

window.DrawingBoard = function(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    // 操作历史
    this.history = [];
    this.command = {};
    this.init();
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
        this.foreCtx.lineCap = 'round';
        this.foreCtx.lineWidth = 2;
    },
    /**
     * 初始化背景canvas
     */
    initBackground: function() {
        this.background = this.cfg.wrap.querySelector('.background');
        this.backCtx = this.background.getContext('2d');
        this.backCtx.font = '14px "Microsoft YaHei", sans-serif';
        this.backCtx.textBaseline = 'top'
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

        canvas.addEventListener('mousedown', (e) => {
            if (this.command.type === CMD_TYPE.move) {
                this.startX = e.offsetX;
                this.startY = e.offsetY;
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
                let {offsetX, offsetY} = e.touches[0];
                foreCtx.moveTo(offsetX, offsetY);
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

        canvas.addEventListener('click', (e) => {
            if (this.command.type === CMD_TYPE.click) {
                this.command.exe(e)
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
    },
    drawText: function (text, x, y) {
        this.recordHistory();
        this.backCtx.fillText(text, x, y);
    }
};
