const GROUND_HEIGHT = 24;
const GROUND_WIDTH = 10;
const CEIL_WIDTH = 30;

class BaseCeil {
    constructor() {
        this.core = document.createElement('div');
        this.core.innerHTML = '<div></div><div></div><div></div>';
        this.children = [...this.core.children];
        this.core.classList.add('core-ceil');
        this.rotateState = 0;
        this.rotateMinX = 1;
        this.rotateMaxX = GROUND_WIDTH - 2;
        this.rotateMaxY = GROUND_HEIGHT - 2;
        this.x = 4;
        this.y = 2;
        this.width = CEIL_WIDTH;
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
            this.rotateState = (this.rotateState + 1) % this.subCoordinates.length;
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

    render() {
        this.core.style.transform = `translate( ${this.x * CEIL_WIDTH}px, ${(this.y - 4) * CEIL_WIDTH}px)`;
        this.subCoordinates[this.rotateState].forEach(([x, y], index) => {
            this.setChild(index, x, y);
        });
    }

    getPoints() {
        return [[this.x, this.y]].concat(this.subCoordinates[this.rotateState]
            .map(([x, y]) => [this.x + x, this.y + y]));
    }

    init() {
        this.rotateState = ~~(Math.random() * this.subCoordinates.length);
        this.render();
        return this;
    }
}

class I extends BaseCeil {
    constructor() {
        super();
        this.y = 1;
        this.rotateMaxX = GROUND_WIDTH - 3;
        this.rotateMaxY = GROUND_HEIGHT - 3;
        this.subCoordinates = [
            [[0, -1], [0, 1], [0, 2]],
            [[-1, 0], [1, 0], [2, 0]]
        ]
    }
}

class T extends BaseCeil {
    constructor() {
        super();
        this.subCoordinates = [
            [[0, -1], [-1, 0], [1, 0]],
            [[0, -1], [0, 1], [1, 0]],
            [[-1, 0], [0, 1], [1, 0]],
            [[-1, 0], [0, 1], [0, -1]]
        ]
    }
}

class S extends BaseCeil {
    constructor() {
        super();
        this.subCoordinates = [
            [[0, -1], [1, 0], [1, 1]],
            [[1, 0], [0, 1], [-1, 1]]
        ]
    }
}

class Z extends BaseCeil {
    constructor() {
        super();
        this.subCoordinates = [
            [[1, -1], [1, 0], [0, 1]],
            [[1, 1], [0, 1], [-1, 0]]
        ]
    }
}

class J extends BaseCeil {
    constructor() {
        super();
        this.subCoordinates = [
            [[0, -1], [0, 1], [-1, 1]],
            [[-1, -1], [-1, 0], [1, 0]],
            [[0, -1], [1, -1], [0, 1]],
            [[-1, 0], [1, 0], [1, 1]]
        ]
    }
}

class L extends BaseCeil {
    constructor() {
        super();
        this.subCoordinates = [
            [[0, -1], [0, 1], [1, 1]],
            [[1, 0], [-1, 0], [-1, 1]],
            [[0, -1], [0, 1], [-1, -1]],
            [[-1, 0], [1, 0], [1, -1]]
        ]
    }
}

class O extends BaseCeil {
    constructor() {
        super();
        this.rotateMinX = 0;
        this.subCoordinates = [
            [[1, 0], [1, 1], [0, 1]]
        ]
    }
}

class Tetris {
    constructor() {
        this.ground = document.querySelector('.ground');
        this.scoreElem = document.querySelector('.score');
        this.nextElem = document.querySelector('.next');
    }

    createCeil() {
        let random = [I, O, S, Z, T, L, J][~~(Math.random() * 7)];
        return (new random).init();
    }

    appendNewCeil() {
        this.curCeil && this.curCeil.core.remove();
        this.curCeil = this.nextCeil;
        this.ground.appendChild(this.curCeil.core);
        this.nextCeil = this.createCeil();
        this.nextElem.innerHTML = '';
        this.nextElem.appendChild(this.cloneCeil(this.nextCeil));
        if (!this.impactCheck(this.curCeil.getPoints())) {
            this.gameOver = true;
            alert('游戏结束, 得分:'+ this.score);
        }
    }

    cloneCeil(ceil) {
        let c = ceil.core.cloneNode();
        c.innerHTML = ceil.core.innerHTML;
        return c;
    }

    appendPoints(x, y) {
        let p = document.createElement('div');
        p.className = 'fixed-ceil';
        p.style.transform = `translate( ${x * this.curCeil.width}px, ${(y - 4) * this.curCeil.width}px)`;
        this.ground.appendChild(p);
        this.points[y][x] = p;
    };

    impactCheck(points) {
        return points.every(([x, y]) => {
            return x > -1 && x < GROUND_WIDTH && y < GROUND_HEIGHT && !this.points[y][x];
        });
    }

    calcScore() {
        let score = 0;
        this.points.forEach((rowPoints, rowIndex) => {
            let full = rowPoints.every(point => point);
            if (full) {
                score++;
                rowPoints.forEach((point) => {
                    point.remove();
                });
                for (let i = rowIndex; i > 0; i--) {
                    this.points[i] = this.points[i - 1];
                    let y = (i - 4) * this.curCeil.width;
                    this.points[i].forEach((point, pIndex) => {
                        if (point) {
                            point.style.transform = `translate(${pIndex * this.curCeil.width}px, ${y}px)`;
                        }
                    });
                }
                this.points[0] = new Array(10).fill(0);
            }
        });
        this.score += score * score * 10;
        if (score) {
            this.scoreElem.innerHTML = this.score;
            this.checkEgg(score);
        }
    }

    checkEgg(score) {
        if (this.egg) {
            if (this.egg[0] === score) {
                this.egg.shift();
                if (this.egg.length === 0) {
                    this.showEgg();
                    this.egg = null;
                }
            } else {
                this.egg = null;
            }
        }
    }

    addPoints(points) {
        points.forEach(([x, y]) => {
            this.appendPoints(x, y);
        });
        this.calcScore();
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

    exeLeftCommand() {
        this.curCeil.tryMoveLeft((nextPoints) => this.impactCheck(nextPoints));
    }

    exeRightCommand() {
        this.curCeil.tryMoveRight((nextPoints) => this.impactCheck(nextPoints));
    }

    exeRotateCommand() {
        this.curCeil.tryRotate((nextPoints) => this.impactCheck(nextPoints));
    }


    initListener() {
        let body = document.body;
        body.addEventListener('keydown', (e) => {
            switch(e.keyCode) {
                case 32:
                case 38:    
                    this.exeRotateCommand();
                    break;
                case 37:
                    this.exeLeftCommand();
                    break;
                case 39:
                    this.exeRightCommand();
                    break;
                case 40:
                    this.next();
                    break;
            }
        });
        let ctrlLeft = document.querySelector('.left');
        let leftKey;
        ctrlLeft.addEventListener('touchstart', () => {
            leftKey = setInterval(() => {
                this.exeLeftCommand();
            }, 120);
            this.exeLeftCommand();
        });

        ctrlLeft.addEventListener('touchend', () => {
            clearInterval(leftKey);
        });

        let ctrlRight = document.querySelector('.right');
        let rightKey;
        ctrlRight.addEventListener('touchstart', () => {
            rightKey = setInterval(() => {
                this.exeRightCommand();
            }, 120);
        });

        ctrlRight.addEventListener('touchend', () => {
            this.exeRightCommand();
            clearInterval(rightKey);
        });

        let ctrlDown = document.querySelector('.down');
        let downKey;
        ctrlDown.addEventListener('touchstart', () => {
            this.next();
            downKey = setInterval(() => {
                this.next();
            }, 30);
        });

        ctrlDown.addEventListener('touchend', () => {
            clearInterval(downKey);
        });

        document.querySelector('.transform').addEventListener('click', () => {
            this.exeRotateCommand();
        });

    }

    showEgg() {
        document.body.classList.add('ed');
        document.querySelector('.tip').innerHTML = `
        曾经有个人<br>  她喜欢柠檬<br>不喜欢柠檬酸
        `;
    }

    start() {
        this.egg = [1, 1, 2, 2];
        this.score = 0;
        this.points = new Array(GROUND_HEIGHT).fill(null).map(_ => new Array(GROUND_WIDTH).fill(0));
        this.nextCeil = this.createCeil();
        this.appendNewCeil();
        this.initListener();
        this.key = setInterval(() => {
            this.next();
            if (this.gameOver) {
                clearInterval(this.key);
            }
        }, 500);
    }
}

let game = new Tetris();
game.start();