import {
    getDomData,
    removeClass,
    addClass,
    hasClass,
    toggleClass,
    getEventOffset
} from './drawingBoardUtil.js'

import commands, {CMD_TYPE} from './commands.js';
import './canvasContextPloyfill.js';

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
        this.boxElem = this.cfg.wrap.querySelector('.drawing-board-box');
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
        this.foreCtx.lineJoin = 'round';
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

        let touchdown = (e) => {
            this.hideSubmenu();
            if (this.command.type === CMD_TYPE.move) {
                let {offsetX, offsetY} = getEventOffset(e, this.foreground);
                this.startX = offsetX;
                this.startY = offsetY;
                foreCtx.beginPath();
                foreCtx.moveTo(this.startX, this.startY);
                if (e.touches) {
                    canvas.addEventListener('touchmove', this.command.exe);
                } else {
                    canvas.addEventListener('mousemove', this.command.exe);
                }
            }
        };

        let touchup = (e) => {
            if (this.command.type === CMD_TYPE.move) {
                if (e.changedTouches) {
                    canvas.removeEventListener('touchmove', this.command.exe);
                } else {
                    canvas.removeEventListener('mousemove', this.command.exe);
                }
                this.recordHistory();
                this.addForeToBack();
            }
        };

        canvas.addEventListener('mousedown', touchdown);

        canvas.addEventListener('mouseup', touchup);

        canvas.addEventListener('touchstart', touchdown);

        canvas.addEventListener('touchend', touchup);

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
                    let parent = this.parentElement.parentElement;
                    me.hideSubmenu();
                    removeClass(parent.querySelector('.active'), 'active');
                    addClass(this, 'active');
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
                            activeElem && me.hideSubmenu();
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
     * 隐藏二级菜单
     */
    hideSubmenu: function() {
        removeClass(this.cfg.wrap.querySelector('.menu.show'), 'show');
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
    drawText: function (text, x, y, width) {
        this.recordHistory();
        this.backCtx.wrapText(text, x, y, width);
    }
};
