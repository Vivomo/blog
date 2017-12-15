//(function () {
    avalon.config({
        interpolate: ["[[","]]"]
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
        nextSquare: function(point, direction){
            var x, y;
            if (direction % 2 == 0) {
                y = point.y;
                x = point.x + direction - 1;
            } else {
                x = point.x;
                y = point.y + direction - 2;
            }
            return {
                x,
                y
            }
        }
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
        $id : 'snake',
        tip: '',
        ceilLength: 11,
        body: [],
        square: [],
        direction : DIRECTION.TOP, // 0123 依次代表左上右下
        ceilWidth : 60,
        directionKeyBind: function(e){
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
        move : function () {

            var head = snake.body[0];
            var ceil = Square.nextSquare(head, snake.direction);
            if (snake.isOutOfIndex(ceil) || snake.isOnBody(ceil)) {
                snake.tip = 'Game Over!';
                document.removeEventListener('keydown', snake.directionKeyBind);
                snake.stop();
                return;
            }
            if (snake.isFood(ceil)) {
                snake.eat(ceil);
                return;
            }
            for (var i = snake.body.length - 1; i > 0; i--) {
                snake.body[i].x = snake.body[i-1].x;
                snake.body[i].y = snake.body[i-1].y;
            }


            switch (snake.direction) {
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
            snake.body.unshift(food);
            snake.square[food.y][food.x].isFood = false;
            snake.createFood();
        },
        isOutOfIndex: function (ceil) {
            return ceil.x < 0 || ceil.x >= snake.ceilLength || ceil.y < 0 || ceil.y >= snake.ceilLength
        },
        isOnBody: function (ceil) {
            return snake.body.some(function (item) {
                return item.x == ceil.x && item.y == ceil.y
            })
        },
        isFood: function (ceil) {
            return snake.square[ceil.y][ceil.x].isFood;
        },
        createFood : function () {
            while (true) {
                var x = ~~ (Math.random() * snake.ceilLength);
                var y = ~~ (Math.random() * snake.ceilLength);

                if (!snake.isOnBody({
                        x: x,
                        y: y
                    })) {
                    snake.square[y][x].isFood = true;
                    break;
                }
            }
        },

        init : function (auto = false) {
            this.auto = auto;

            if (!this.auto) {
                document.addEventListener('keydown', snake.directionKeyBind);
            }

            snake.body = Snake.createSnakeBody();
            snake.square = Square.createSquare();
            snake.createFood();
            snake.start();
        },
        stop : function () {
            clearInterval(snake.interval);
        },
        start : function () {
            snake.interval = setInterval(function () {
                snake.move();
            }, Snake.cfg.speed);
        }
    });


    snake.init();

    avalon.scan();

//})();
