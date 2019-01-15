function DrawingBoard(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    this.init();
}

DrawingBoard.prototype = {
    constructor: DrawingBoard,
    defaultCfg: {},
    init: function() {
        this.initHtml();
        this.initEvent();
    },
    initHtml: function() {
        this.initForeground()
    },
    initForeground: function() {
        this.foreground = this.cfg.wrap.querySelector('.foreground');
        this.ctx = this.foreground.getContext('2d');
        let {left, top} = this.foreground.getBoundingClientRect();
        this.canvasOffsetX = left;
        this.canvasOffsetY = top;
        this.command = this.commands.draw.bind(this);
    },
    initEvent: function() {
        this.initForegroundEvent();
    },
    commands: {
        draw: function ({clientX, clientY}) {
            let {canvasOffsetX, canvasOffsetY, ctx} = this;
            ctx.lineCap = 'round';
            ctx.lineTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
            ctx.stroke();
        }
    },
    initForegroundEvent: function () {
        let canvas = this.foreground;
        let ctx = this.ctx;
        let {canvasOffsetX, canvasOffsetY} = this;

        canvas.addEventListener('mousedown', (e) => {
            let {clientX, clientY} = e;
            ctx.beginPath();
            ctx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
            canvas.addEventListener('mousemove', this.command)
        });

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', this.command)
        });

        canvas.addEventListener('touchstart', (e) => {
            ctx.beginPath();
            let {clientX, clientY} = e.touches[0];
            ctx.moveTo(clientX - canvasOffsetX, clientY - canvasOffsetY);
            canvas.addEventListener('touchmove', drawWap)
        });

        canvas.addEventListener('touchend', () => {
            canvas.removeEventListener('touchmove', drawWap)
        });
    }
};
