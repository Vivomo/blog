//(function () {
avalon.config({
    interpolate: ["[[", "]]"]
});

var DIRECTION = {
    LEFT: 0,
    TOP: 1,
    RIGHT: 2,
    DOWN: 3
};

const Square = {
    cfg: {
        width: 11
    },
    createSquare: function () {
        return avalon.range(0, this.cfg.width).map(() =>
            avalon.range(0, this.cfg.width).map(() => ({
                isFood: false
            }))
        );
    },
    nextSquare: function (point, direction) {
        var x, y;
        if (direction % 2 == 0) {
            y = point.y;
            x = point.x + direction - 1;
        } else {
            x = point.x;
            y = point.y + direction - 2;
        }
        return { x, y };
    },
    createRandomPoint: () => ({
        x: ~~(Square.cfg.width * Math.random()),
        y: ~~(Square.cfg.width * Math.random())
    })
};

const Snake = {
    cfg: {
        speed: 1500,
    },
    createSnakeBody: function () {
        const center = ~~(Square.cfg.width / 2);
        return avalon.range(0, 4).map((i) => ({
            x: center,
            y: center + i
        }));
    },
};


var snake = avalon.define({
    $id: 'snake',
    $task: [],
    tip: '',
    body: [],
    square: [],
    direction: DIRECTION.TOP, // 0123 依次代表左上右下
    ceilWidth: 60,
    directionKeyBind: function (e) {
        if (e.keyCode < 37 || e.keyCode > 40) {
            return
        }
        var direction = e.keyCode - 37;
        if (Math.abs(direction - snake.direction) != 2) {
            snake.direction = direction;
            snake.stop();
            snake.move();
            snake.start();
        }
    },
    move: function () {

        var head = this.body[0];
        var ceil = Square.nextSquare(head, this.direction);
        if (this.isOutOfIndex(ceil) || this.isOnBody(ceil)) {
            this.tip = 'Game Over!';
            document.removeEventListener('keydown', this.directionKeyBind);
            this.stop();
            return;
        }
        if (this.isFood(ceil)) {
            this.eat(ceil);
            return;
        }
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        switch (this.direction) {
            case 0:
                head.x -= 1;
                break;
            case 1:
                head.y -= 1;
                break;
            case 2:
                head.x += 1;
                break;
            case 3:
                head.y += 1;
                break;
        }

    },
    eat: function (food) {
        this.body.unshift(food);
        this.square[food.y][food.x].isFood = false;
        this.createFood();
    },
    isOutOfIndex: function (ceil) {
        return ceil.x < 0 || ceil.x >= Snake.cfg.width || ceil.y < 0 || ceil.y >= Snake.cfg.width
    },
    isOnBody: function (ceil) {
        return this.body.some(function (item) {
            return item.x == ceil.x && item.y == ceil.y
        })
    },
    isFood: function (ceil) {
        return this.square[ceil.y][ceil.x].isFood;
    },
    createFood: function () {
        while (true) {
            let point = Square.createRandomPoint();
            if (!this.isOnBody(point)) {
                this.square[point.y][point.x].isFood = true;
                break;
            }
        }
    },
    runShortestPath: function (start, end) {

    },
    init: function (auto = false) {
        this.auto = auto;

        this.body = Snake.createSnakeBody();
        this.square = Square.createSquare();
        this.createFood();
        this.start();

        if (this.auto) {

        } else {
            document.addEventListener('keydown', this.directionKeyBind);
        }
    },
    stop: function () {
        clearInterval(this.interval);
    },
    start: function () {
        this.interval = setInterval(snake.move, Snake.cfg.speed);
    }
});


snake.init();

avalon.scan();

//})();
