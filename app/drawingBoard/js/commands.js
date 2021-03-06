import {getEventOffset} from './drawingBoardUtil.js';
import Cropper from './cropper.js';


export const CMD_TYPE = {
    move: 'move',
    once: 'once',
    click: 'click'
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
        exe: function (e) {
            let {offsetX, offsetY} = getEventOffset(e, this.foreground);
            let {foreCtx} = this;
            foreCtx.lineTo(offsetX, offsetY);
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
            if (key === 'strokeStyle') {
                this.boxElem.style.color = value;
                this.backCtx.fillStyle = value;
            }
        }
    },
    /**
     * 橡皮擦
     */
    eraser: {
        type: CMD_TYPE.move,
        exe: function (e) {
            let {offsetX, offsetY} = getEventOffset(e, this.foreground);
            let {backCtx, eraserRadius} = this;
            backCtx.clearRect(offsetX, offsetY, eraserRadius, eraserRadius);
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
            let {offsetX, offsetY} = getEventOffset(e, this.foreground);
            let {foreCtx, width, height, startX, startY} = this;
            let dx = offsetX - startX;
            let dy = offsetY - startY;
            foreCtx.beginPath();
            foreCtx.clearRect(0, 0, width, height);
            switch (this.shape) {
                case 'line':
                    foreCtx.moveTo(startX, startY);
                    foreCtx.lineTo(offsetX, offsetY);
                    break;
                case 'rect':
                    foreCtx.strokeRect(startX, startY, dx, dy);
                    break;
                case 'circle':
                    foreCtx.ellipse((startX + offsetX) / 2, (startY + offsetY) / 2, Math.abs(dx) / 2, Math.abs(dy) / 2, 0, 0, Math.PI * 2);
                    break;
            }
            foreCtx.stroke();
        }
    },
    text: {
        type: CMD_TYPE.click,
        exe: function (e) {
            let {offsetX, offsetY} = getEventOffset(e, this.foreground);
            let {cropper} = this;
            if (cropper) {
                cropper.setLeft(offsetX, false);
                cropper.setTop(offsetY, false, true);
                cropper.show();
            } else {
                let cropper = this.cropper = new Cropper({
                    elem: this.cfg.wrap.querySelector('.drawing-board-box'),
                    onHide: (cropper, text) => {
                        if (text) {
                            let data = cropper.getData();
                            cropper.clearContent();
                            this.drawText(text, data.left, data.top, data.width);
                        }
                    }
                });
                cropper.setLeft(offsetX, false);
                cropper.setTop(offsetY, false, true);
            }
        }
    }
};

export default commands;
