function DrawingBoard(cfg) {
    this.cfg = Object.assign({}, this.defaultCfg, cfg);
    this.init();
}

DrawingBoard.prototype = {
    constructor: DrawingBoard,
    defaultCfg: {
        maxHistorySize: 20
    },
    history: [],
    init: function() {
        this.initHtml();
        this.initCanvas();
        this.initEvent();
    },
    initHtml: function() {
    },
    initCanvas: function() {
        this.initForeground();
        this.initBackground();
    },
    initForeground: function() {
        this.foreground = this.cfg.wrap.querySelector('.foreground');
        this.width = this.foreground.width;
        this.height = this.foreground.height;
        this.ctx = this.foreground.getContext('2d');
        let {left, top} = this.foreground.getBoundingClientRect();
        this.canvasOffsetX = left;
        this.canvasOffsetY = top;
        this.command = this.commands.draw.bind(this);
    },
    initBackground: function() {
        this.background = this.cfg.wrap.querySelector('.background');
        this.backCtx = this.background.getContext('2d');
        this.backCtx.globalCompositeOperation = 'lighter';
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
            canvas.removeEventListener('mousemove', this.command);
            this.updateHistory();
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
    },
    updateHistory: function () {
        this.backCtx.drawImage(this.foreground, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.history.push(this.backCtx.getImageData(0, 0, this.width, this.height));
        if (this.history.length > this.cfg.maxHistorySize) {
            this.history.unshift();
        }
    }
};
