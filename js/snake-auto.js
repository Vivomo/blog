avalon.config({
    interpolate: ["[[", "]]"]
});

let DIRECTION = {
    LEFT: 0,
    TOP: 1,
    RIGHT: 2,
    DOWN: 3
};

const Square = {
    cfg: {
        width: 11,
        total: 11 * 11
    },
    createSquare() {
        return avalon.range(0, this.cfg.width).map(() =>
            avalon.range(0, this.cfg.width).map(() => ({
                isFood: false
            }))
        );
    },
    nextSquare(point, direction) {
        let x, y;
        if (direction % 2 === 0) {
            y = point.y;
            x = point.x + direction - 1;
        } else {
            x = point.x;
            y = point.y + direction - 2;
        }
        return { x, y };
    }
};

let snake = avalon.define({
    $id: 'snake',
    $food: null,
    $moving: false,
    $moveStep: 0,
    $foodCost: [],
    $time: 0,
    body: [],
    square: [],
    direction: DIRECTION.TOP, // 0123 依次代表左上右下
    ceilWidth: 60,

    createSnakeBody() {
        const center = ~~(Square.cfg.width / 2);
        return avalon.range(0, 4).map((i) => ({
            x: center,
            y: center + i
        }));
    },

    movePoint(from, to) {
        from.x = to.x;
        from.y = to.y;
    },

    move() {
        let head = this.body[0];
        let ceil = Square.nextSquare(head, this.direction);
        if (!this.validPoint(ceil)) {
            throw 'failed'
        }
        this.$moveStep++;
        if (this.isFood(ceil)) {
            this.eat(ceil);
            let prevStep = this.$foodCost.length === 0 ? 0 : this.$foodCost[this.$foodCost.length - 1].moveStep;
            this.$foodCost.push({
                ...ceil,
                step: this.$moveStep - prevStep,
                moveStep: this.$moveStep
            });
            return;
        }
        for (let i = this.body.length - 1; i > 0; i--) {
            this.movePoint(this.body[i], this.body[i- 1]);
        }
        this.movePoint(head, Square.nextSquare(head, this.direction));
    },
    eat(food) {
        this.body.unshift(food);
        this.square[food.y][food.x].isFood = false;
        this.createFood();
    },
    isOutOfIndex(ceil) {
        return ceil.x < 0 || ceil.x >= Square.cfg.width || ceil.y < 0 || ceil.y >= Square.cfg.width
    },
    isOnBody(point, end = this.body.length) {
        return this.isOnPathPoints(point, this.body.slice(0, end));
    },
    isOnPathPoints(point, points) {
        return points.some(item => item.x === point.x && item.y === point.y);
    },
    isFood({ x, y }) {
        return this.square[y][x].isFood;
    },
    createFood() {
        let w = Square.cfg.width;
        let total = w * w;
        let surplus = total - this.body.length;
        if (surplus === 0) {
            this.$food = null;
            return;
        }
        let randomIndex = ~~(Math.random() * surplus);
        for (let i = randomIndex; i < total + randomIndex; i++) {
            let y = (~~(i / w)) % w;
            let x = i % w;
            let point = { x, y };
            if (!this.isOnBody(point)) {
                this.$food = point;
                this.square[point.y][point.x].isFood = true;
                break;
            }
        }
    },
    isSamePoint(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    },
    bfs(from, target, hinder) {
        let stack = [
            [{
                x: from.x,
                y: from.y
            }]
        ];
        let blankSquare = new Array(Square.cfg.width).fill(0).map(() => {
            return new Array(Square.cfg.width).fill(0);
        });

        hinder.forEach((point) => {
            blankSquare[point.y][point.x] = 1;
        });

        while (true) {
            let next = [];
            let last = stack[stack.length - 1];
            let find = last.some((point) => {
                for (let i = 0; i < 4; i++) {
                    let newPoint = Square.nextSquare(point, i);
                    if (this.isOutOfIndex(newPoint) || blankSquare[newPoint.y][newPoint.x]) {
                        continue;
                    }
                    newPoint.prev = point;
                    newPoint.direction = i;
                    blankSquare[newPoint.y][newPoint.x] = 1;
                    next.push(newPoint);
                    if (this.isSamePoint(target, newPoint)) {
                        return true;
                    }
                }
            });
            if (next.length === 0) {
                return null;
            }
            stack.push(next);
            if (find) {
                let end = stack.pop().pop();
                let path = [];
                while (end) {
                    path.push(end.direction);
                    end = end.prev;
                }
                path.pop();
                return path;
            }
        }
    },
    getFullPath() {
        let stack = [
            [{
                x: this.body[0].x,
                y: this.body[0].y,
                pathPoints: []
            }]
        ];
        let tail = this.body[this.body.length - 1];
        let max = [];
        let findFood = false;
        let blankSquare = new Array(Square.cfg.width).fill(0).map(() => {
            return new Array(Square.cfg.width).fill(0);
        });

        this.body.slice(0, this.body.length - 1).forEach((point) => {
            blankSquare[point.y][point.x] = 1;
        });
        while (true) {
            let next = [];
            let last = stack[stack.length - 1];
            last.forEach((point) => {
                for (let i = 0; i < 4; i++) {
                    let newPoint = Square.nextSquare(point, i);
                    if (this.isSamePoint(this.$food, newPoint)) {
                        findFood = true;
                    }
                    let pathPoints = point.pathPoints;
                    if (this.isOutOfIndex(newPoint) || this.isOnPathPoints(newPoint, pathPoints) ||
                        blankSquare[newPoint.y][newPoint.x]
                    ) {
                        continue;
                    }
                    newPoint.direction = i;
                    newPoint.pathPoints = [...pathPoints, newPoint];
                    next.push(newPoint);
                    if (this.isSamePoint(tail, newPoint) && newPoint.pathPoints.length > max.length) {
                        max = newPoint.pathPoints;
                    }
                }
            });
            if (next.length === 0) {
                break;
            }
            stack.push(next);
        }
        if (findFood && !this.isOnPathPoints(this.$food, max)) {
            let path = this.pathfinding();
            if (path && this.mockValid([...path])) {
                return path;
            }
        }

        return max.map(_ => _.direction).reverse();
    },
    detour() {
        let head = this.body[0];
        let tail = this.body[this.body.length - 1];
        let distance = -1;
        let direction = -1;
        let nextPoints = [];
        for (let i = 0; i < 4; i++) {
            let newPoint = Square.nextSquare(head, i);
            nextPoints.push(newPoint);
            if (this.validPoint(newPoint) &&
                (
                    this.isSamePoint(newPoint, tail) ||
                    this.bfs(newPoint, tail, this.body.slice(0, this.body.length - 1))
                )
            ) {
                let _d = this.getDistance(newPoint, tail);
                if (_d > distance) {
                    distance = _d;
                    direction = i;
                }
            }
        }
        // will follow tail
        if (distance === 0) {
            let prevTail = this.body[this.body.length - 2];
            nextPoints.some((point, index) => {
                if (this.validPoint(point) && !this.isSamePoint(point, tail) &&
                    this.getDistance(point, prevTail) === 1 && !this.isSamePoint(point, this.$food)) {
                    direction = index;
                    return true;
                }
            });
        }
        return direction;
    },
    getDistance(p1, p2) {
        return Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2);
    },
    pathfinding() {
        return this.bfs(this.body[0], this.$food, this.body);
    },
    runPath(path) {
        requestAnimationFrame(() => {
            this.direction = path.pop();
            this.move();
            if (path.length > 0) {
                this.runPath(path);
            } else if (this.$food) {
                this.$moving = false;
                this.autoPathfinding();
            } else {
                // let time = Date.now() - this.$time;
                // localStorage.success += 1;                
                // localStorage.data += `[${this.$foodCost.map(_ => _.step)}]---${time}\n`;
                // if (localStorage.success.length === 50) {
                //     alert('done');
                //     return;
                // }
                // setTimeout(() => {
                //     location.reload();
                // }, 1000);
            }
        })
    },
    validPoint(point) {
        return !this.isOutOfIndex(point) && !this.isOnBody(point, this.body.length - 1);
    },
    mockValid(path) {
        if (path.length > this.body.length || this.body.length === Square.cfg.total - 1) {
            return true;
        }
        let curPoint = this.body[0];
        let newBodyPoints = path.reverse().map((direction) => {
            return (curPoint = Square.nextSquare(curPoint, direction));
        });
        let hinder = newBodyPoints.concat(this.body.slice(0, this.body.length - path.length));
        return !!this.bfs(this.$food, this.body[this.body.length - path.length], hinder);
    },
    autoPathfinding() {
        if (this.$moving) {
            return;
        }
        this.$moving = true;
        if (Square.cfg.total / this.body.length <= 1.25 && Square.cfg.total - this.body.length > 3) {
            this.runPath(this.getFullPath());
            return;
        }
        let path = this.pathfinding();

        if (path && this.mockValid([...path])) {
            this.runPath(path);
            return;
        }
        let detourPath = this.detour();

        if (detourPath !== -1) {
            this.runPath([detourPath]);
        }

    },
    init() {
        this.body = this.createSnakeBody();
        this.square = Square.createSquare();
        this.createFood();
        setTimeout(() => {
            // this.$time = Date.now();
            this.autoPathfinding();
        }, 1000);
    },

});

avalon.scan();
snake.init();

setTimeout(() => {
    if (snake.$food) {
        // localStorage.fail += `${99 - snake.body.length}--`;
        alert('好像出现了盲点');
        location.reload();
    }
}, 100000);



document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
        snake.autoPathfinding();
    }
    if (e.keyCode < 37 || e.keyCode > 40) {
        return
    }
    let direction = e.keyCode - 37;
    if (Math.abs(direction - snake.direction) !== 2) {
        snake.direction = direction;
        snake.move();
    }
});


