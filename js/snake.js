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

    function nextSquare(head, direction){
        var x, y;
        if (direction % 2 == 0) {
            y = head.y;
            x = head.x + direction - 1;
        } else {
            x = head.x;
            y = head.y + direction - 2;
        }
        return {
            x: x,
            y: y
        }
    }

    function directionKeyBind(e){
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
    }



    var snake = window.snake = avalon.define({
        $id : 'snake',
        tip: '',
        ceilLength: 11,
        body: [],
        square: [],
        direction : DIRECTION.TOP, // 0123 依次代表左上右下
        speed : 1500,
        ceilWidth : 60,
        move : function () {

            var head = snake.body[0];
            var ceil = nextSquare(head, snake.direction);
            if (snake.isOutOfIndex(ceil) || snake.isOnBody(ceil)) {
                snake.tip = 'Game Over!';
                document.removeEventListener('keydown', directionKeyBind);
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
        init : function () {
            var startX = 5,
                startY = 5,
                snakeArr = [],
                square = [], i, j;

            for (i = 0; i < 4; i++) {
                snakeArr.push({
                    x : startX,
                    y : startY + i
                })
            }

            snake.body = snakeArr;

            for (i = 0; i < snake.ceilLength; i++) {
                square.push([]);
                for (j = 0; j < snake.ceilLength; j++) {
                    square[i].push({
                        isFood : false
                    })
                }
            }
            snake.square = square;

            document.addEventListener('keydown', directionKeyBind);

            snake.createFood();
            snake.start();
        },
        stop : function () {
            clearInterval(snake.interval);
        },
        start : function () {
            snake.interval = setInterval(function () {
                snake.move();
            }, snake.speed);
        }
    });


    snake.init();

    avalon.scan();




//})();
