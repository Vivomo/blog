class Radar{
    constructor({canvas, data}) {
        this.canvas = document.querySelector(canvas);
        this.data = data;
        this.init();
    }

    init() {
        this.ctx = this.canvas.getContext('2d');
        this.indicatorCount = this.data.indicator.length;
        this.indicatorRad = Math.PI * 2 / this.indicatorCount;

        let {width, height} = this.canvas;
        let minSide = Math.min(width, height);
        this.r = minSide * 0.85 / 2; //参照了百度雷达半径和短边的对比
    }

    draw() {
        let {width, height} = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        this._drawBg();
        this._drawArea();
    }

    /**
     * 绘制背景线条
     * @private
     */
    _drawBg() {
        let {ctx, r, indicatorCount, indicatorRad} = this;
        let centerX = ~~(width / 2);
        let centerY = ~~(height / 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#999';
        for (let i = 0; i < indicatorCount; i++) {
            let degree = Math.PI / 2 -  indicatorRad * i;
            let x = centerX + Math.cos(degree) * r;
            let y = centerX - Math.sin(degree) * r;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(~~x, ~~y);
        }

        let startX, startY;
        for (let j = 1; j <= 5; j++) {
            for (let i = 0; i < indicatorCount; i++) {
                let _r = r * j / 5;
                let degree = Math.PI / 2 -  indicatorRad * i;
                let x = ~~(centerX + Math.cos(degree) * _r);
                let y = ~~(centerX - Math.sin(degree) * _r);
                if (i === 0) {
                    startX = x;
                    startY = y;
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineTo(startX, startY);
        }

        ctx.stroke();
    }

    /**
     * 绘制数据面积区域
     * @private
     */
    _drawArea() {
        let {ctx, indicatorCount, data, indicatorRad} = this;
        ctx.beginPath();
        ctx.strokeStyle = '#13bbff';
        ctx.fillStyle = 'rgba(19, 187, 255, 0.7)';

        let startX, startY;

        for (let i = 0; i < indicatorCount; i++) {
            let _r = r * data.data[i] / data.indicator[i].max;
            let degree = Math.PI / 2 -  indicatorRad * i;
            let x = ~~(centerX + Math.cos(degree) * _r);
            let y = ~~(centerX - Math.sin(degree) * _r);
            if (i === 0) {
                startX = x;
                startY = y;
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(startX, startY);

        ctx.fill();
        ctx.stroke();
    }
}