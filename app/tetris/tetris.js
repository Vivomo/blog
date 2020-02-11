class BaseCeil {
    constructor() {
        this.core = document.createElement('div');
        this.core.classList.add('core-ceil');
        this.rotateState = 0;
        this.initX = 5;
    }

    setChild(index, x, y) {
        this.children[index].style.transform = `translate( ${x * 100}%, ${y * 100}%)`;
    }

    tryDrop(cb) {
        this.tryTransform(() => {
            this.y++;
        }, cb);
    }

    tryMoveLeft(cb) {
        this.tryTransform(() => {
            this.x--;
        }, cb);
    }

    tryMoveRight(cb) {
        this.tryTransform(() => {
            this.x++;
        }, cb);
    }

    tryRotate(cb) {
        this.tryTransform(() => {
            this.x = Math.min(this.rotateMaxX, Math.max(this.rotateMinX, this.x));
            this.y = Math.min(this.rotateMaxY, this.y);
            this.rotateState = (this.rotateState + 1) % this.loopCount;
        }, cb);
    }

    tryTransform(transform, cb) {
        this.backup();
        let points = this.getPoints();
        transform();
        let nextPoints = this.getPoints();
        let result = cb(nextPoints, points);
        if (result) {
            this.render();
        } else {
            this.rollback();
        }
    }

    rotate(direction = 1) {
        this.rotateState = (this.rotateState + direction) % this.loopCount;
        this.render();
    }

    backup() {
        this.prevState = {
            x: this.x,
            y: this.y,
            rotateState: this.rotateState
        }
    }

    rollback() {
        for (let k in this.prevState) {
            this[k] = this.prevState[k];
        }
    }
}

class I extends BaseCeil {
    constructor() {
        super();
        this.core.innerHTML = `
            <div class="i1"></div>
            <div class="i2"></div>
            <div class="i3"></div>
        `;
        this.children = [...this.core.children];
        this.loopCount = 2;
        this.initY = -3;
        this.x = this.initX;
        this.y = this.initY;
        this.rotateMinX = 1;
        this.rotateMaxX = 7;
        this.rotateMaxY = 17;
    }

    
    render() {
        this.core.style.transform = `translate( ${this.x * 30}px, ${this.y * 30}px)`;

        switch(this.rotateState) {
            case 0:
                this.setChild(0, 0, -1);
                this.setChild(1, 0, 1);
                this.setChild(2, 0, 2);
                break;
            default:
                this.setChild(0, -1, 0);
                this.setChild(1, 1, 0);
                this.setChild(2, 2, 0);    
        }
    }

    getPoints() {
        let points = [[this.x, this.y]];
        switch(this.rotateState) {
            case 0:
                points.push([this.x, this.y - 1]);
                points.push([this.x, this.y + 1]);
                points.push([this.x, this.y + 2]);
                break;
            default:
                points.push([this.x - 1, this.y]);
                points.push([this.x + 1, this.y]);
                points.push([this.x + 2, this.y]);
        };
        return points;
    }
    

    init() {
        this.render();
    }

}

class Tetris {
    constructor() {
        this.curCeil = null;
        this.nextCeil = null;
        this.ground = document.querySelector('.ground');
        this.points = new Array(20).fill(null).map(_ => new Array(10).fill(0));
    }

    createCeil() {
        return new I;
    }

    appendNewCeil() {
        this.curCeil = this.nextCeil;
        this.curCeil.init();
        this.ground.appendChild(this.curCeil.core);
        this.nextCeil = this.createCeil();
    }

    impactCheck(points) {
        return points.every(([x, y]) => {
            return y < 0 || 
            (x > -1 && x < 10 && y < 20 && !this.points[y][x]);
        });
    }

    addPoints(points) {
        points.forEach(([x, y]) => {
            if (!this.points[y]) {
                throw 'game over';
            } else {
                this.points[y][x] = 1;
            }
        })
    }

    next() {
        this.curCeil.tryDrop((nextPoints, points) => {
            let result = this.impactCheck(nextPoints);
            if (!result) {
                this.addPoints(points);
                this.appendNewCeil();
            }
            return result;
        });
    }

    initListener() {
        let body = document.body;
        body.addEventListener('keydown', (e) => {
            console.log(e.keyCode);
            switch(e.keyCode) {
                case 32:
                    this.curCeil.tryRotate((nextPoints) => this.impactCheck(nextPoints));
                    break;
                case 37:
                    this.curCeil.tryMoveLeft((nextPoints) => this.impactCheck(nextPoints));
                    break;
                case 39:
                    this.curCeil.tryMoveRight((nextPoints) => this.impactCheck(nextPoints));
                    break;
            }
        });
    }

    start() {
        this.nextCeil = this.createCeil();
        this.appendNewCeil();
        this.initListener();
        setInterval(this.next.bind(this), 500);
    }
}

let game = new Tetris();
game.start();