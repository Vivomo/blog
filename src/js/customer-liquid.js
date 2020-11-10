class Liquid{
    constructor(data) {
        this.mass = data.mass;
        this.viscosity = data.viscosity || 5;
    }

    set viscosity(value){
        let temp = Number(value.toFixed(0));
        if (temp < 1) {
            throw 'viscosity 必须大于等于 1'
        }
        this._viscosity = temp;
    }

    get viscosity() {
        return this._viscosity;
    }
}

class Pen{
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw(liquid, x, y) {
        let ctx = this.ctx;



        ctx.fillStyle = '#8f430708';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(x, y, 100 + i, 0, Math.PI * 2);
            ctx.fill();
        }

        // for (let i = 0; i < 10; i++) {
        //     ctx.beginPath();
        //     ctx.arc(x, y, 100 - 2 * i, 0, Math.PI * 2);
        //     ctx.fill();
        // }

        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(x, y, 110 - i, 0, Math.PI * 2);
            ctx.fill();
        }

        let radial = ctx.createRadialGradient(100,100,20,120,120,50);
        radial.addColorStop(0,'#bf4407');
        radial.addColorStop(0.9,'#8f4307');  // 颜色值 #FF0188 == rgba(255,1,136,1)
        radial.addColorStop(1,'rgba(255,1,136,0)');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.fillRect(0,0,500,500);
        // ctx.arc(300, 300, 110, 0, Math.PI * 2);
        ctx.fill();
    }
}

let canvas = document.querySelector('#canvas');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

let pen = new Pen(ctx);

pen.draw(null, 800, 400);
