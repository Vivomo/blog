let canvas = document.getElementById('canvas');
let w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

let hw = w / 2,
    hh = h / 2;

let opts = {
        strings: ['祝', '聪明伶俐', '活泼可爱', '机智勇敢的', '耳朵', '生日快乐!'],
        charSize: 60,
        charSpacing: 65,
        lineHeight: 80,
        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: .1,
        upFlow: -.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: .4,
        balloonAddedVel: .4,
        balloonBaseRadian: -(Math.PI / 2 - .5),
        balloonAddedRadian: -1,
    },
    calc = {
        totalWidth: opts.charSpacing * Math.max(...opts.strings.map(str => str.length))
    },
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    letters = [];

ctx.font = opts.charSize + 'px Verdana';


class Letter {
    constructor(char, x, y) {
        this.char = char;
        this.x = x;
        this.y = y;

        this.dx = -ctx.measureText(char).width / 2;
        this.dy = +opts.charSize / 2;

        this.fireworkDy = this.y - hh;

        let hue = x / calc.totalWidth * 360;

        this.color = `hsl(${hue},80%,50%)`;
        this.lightAlphaColor = `hsla(${hue},80%,light%,alp)`;
        this.lightColor = `hsl(${hue},80%,light%)`;
        this.alphaColor = `hsla(${hue},80%,50%,alp)`;

        this.reset();
    }

    reset() {
        this.phase = 'firework';
        this.tick = 0;
        this.spawned = false;
        this.spawningTime = opts.fireworkSpawnTime * Math.random() | 0;
        this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() | 0;
        this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, hh, 0]];
    }

    runFirework() {
        this.tick++;
        if (!this.spawned) {
            if (this.tick >= this.spawningTime) {
                this.tick = 0;
                this.spawned = true;
            }
        } else {
            let linearProportion = this.tick / this.reachTime,
                armonicProportion = Math.sin(linearProportion * TauQuarter),

                x = linearProportion * this.x,
                y = hh + armonicProportion * this.fireworkDy;

            if (this.prevPoints.length > opts.fireworkPrevPoints)
                this.prevPoints.shift();

            this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

            let lineWidthProportion = 1 / (this.prevPoints.length - 1);

            for (let i = 1; i < this.prevPoints.length; i++) {
                let point = this.prevPoints[i],
                    point2 = this.prevPoints[i - 1];

                ctx.strokeStyle = this.alphaColor.replace('alp', i / this.prevPoints.length);
                ctx.lineWidth = point[2] * lineWidthProportion * i;
                line(point[0], point[1], point2[0], point2[1]);
            }

            if (this.tick >= this.reachTime) {
                this.phase = 'contemplate';

                this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() | 0;
                this.circleCreating = true;
                this.circleFading = false;

                this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() | 0;
                this.tick = 0;
                this.tick2 = 0;

                this.shards = [];

                let shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() | 0,
                    angle = Tau / shardCount,
                    cos = Math.cos(angle),
                    sin = Math.sin(angle),

                    x = 1,
                    y = 0;

                for (let i = 0; i < shardCount; i++) {
                    let x1 = x;
                    x = x * cos - y * sin;
                    y = y * cos + x1 * sin;

                    this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
                }
            }

        }
    }

    runContemplate() {
        ++this.tick;
        if (this.circleCreating) {

            ++this.tick2;
            let proportion = this.tick2 / this.circleCompleteTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace('light', 50 + 50 * proportion).replace('alp', proportion);
            ctx.beginPath();
            ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 > this.circleCompleteTime) {
                this.tick2 = 0;
                this.circleCreating = false;
                this.circleFading = true;
            }
        } else if (this.circleFading) {
            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            ++this.tick2;
            let proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace('light', 100).replace('alp', 1 - armonic);
            ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 >= this.circleFadeTime)
                this.circleFading = false;

        } else {
            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
        }

        for (let i = 0; i < this.shards.length; i++) {
            this.shards[i].step();

            if (!this.shards[i].alive) {
                this.shards.splice(i, 1);
                --i;
            }
        }

        if (this.tick > opts.letterContemplatingWaitTime) {

            this.phase = 'balloon';

            this.tick = 0;
            this.spawning = true;
            this.spawnTime = opts.balloonSpawnTime * Math.random() | 0;
            this.inflating = false;
            this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() | 0;
            this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() | 0;

            let rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

            this.vx = Math.cos(rad) * vel;
            this.vy = Math.sin(rad) * vel;
        }
    }

    runBalloon() {

        ctx.strokeStyle = this.lightColor.replace('light', 80);

        if (this.spawning) {
            ++this.tick;
            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= this.spawnTime) {
                this.tick = 0;
                this.spawning = false;
                this.inflating = true;
            }
        } else if (this.inflating) {
            ++this.tick;

            let proportion = this.tick / this.inflateTime,
                x = this.cx = this.x,
                y = this.cy = this.y - this.size * proportion;

            ctx.fillStyle = this.alphaColor.replace('alp', proportion);
            ctx.beginPath();
            generateBalloonPath(x, y, this.size * proportion);
            ctx.fill();

            line(x, y, x, this.y);

            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= this.inflateTime) {
                this.tick = 0;
                this.inflating = false;
            }

        } else {
            this.cx += this.vx;
            this.cy += this.vy += opts.upFlow;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            generateBalloonPath(this.cx, this.cy, this.size);
            ctx.fill();

            line(this.cx, this.cy, this.cx, this.cy + this.size);

            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);

            if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
                this.phase = 'done';

        }
    }

    step() {
        if (this.phase === 'firework') {
            this.runFirework();
        } else if (this.phase === 'contemplate'){
            this.runContemplate();
        } else if (this.phase === 'balloon') {
            this.runBalloon();
        }
    }
}

class Shard {
    constructor(x, y, vx, vy, color) {
        let vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

        this.vx = vx * vel;
        this.vy = vy * vel;

        this.x = x;
        this.y = y;

        this.prevPoints = [[x, y]];
        this.color = color;

        this.alive = true;

        this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
    }

    step() {

        this.x += this.vx;
        this.y += this.vy += opts.gravity;

        if (this.prevPoints.length > opts.fireworkShardPrevPoints)
            this.prevPoints.shift();

        this.prevPoints.push([this.x, this.y]);

        let lineWidthProportion = this.size / this.prevPoints.length;

        for (let k = 0; k < this.prevPoints.length - 1; ++k) {

            let point = this.prevPoints[k],
                point2 = this.prevPoints[k + 1];

            ctx.strokeStyle = this.color.replace('alp', k / this.prevPoints.length);
            ctx.lineWidth = k * lineWidthProportion;
            line(point[0], point[1], point2[0], point2[1])

        }

        if (this.prevPoints[0][1] > hh)
            this.alive = false;
    }
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2,
        x - size / 4, y - size,
        x, y - size);
    ctx.bezierCurveTo(x + size / 4, y - size,
        x + size / 2, y - size / 2,
        x, y);
}

function anim() {
    requestAnimationFrame(anim);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(hw, hh);

    let done = letters.every(letter => letter.phase === 'done');
    letters.forEach(letter => letter.step());

    ctx.translate(-hw, -hh);

    if (done) {
        letters.forEach(letter => letter.reset());
    }
}

for (let i = 0; i < opts.strings.length; i++) {
    for (let j = 0; j < opts.strings[i].length; j++) {
        letters.push(new Letter(opts.strings[i][j],
            j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[i].length * opts.charSize / 2,
            i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2));
    }
}

anim();
