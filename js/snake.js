(function () {
    avalon.config({
        interpolate: ["[[","]]"]
    });

    var snake = window.snake = avalon.define({
        $id : 'snake',
        ceilLength: 11,
        body: [],
        square: [],
        direction : 1, // 0123 依次代表左上右下
        speed : 500,
        ceilWidth : 60,
        move : function () {
            for (var i = snake.body.length - 1; i > 0; i--) {
                snake.body[i].x = snake.body[i-1].x;
                snake.body[i].y = snake.body[i-1].y;
            }
            var head = snake.body[0];
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
        makeFood : function () {
            while (true) {
                var x = ~~ (Math.random() * snake.ceilLength);
                var y = ~~ (Math.random() * snake.ceilLength);

                var effective = snake.body.every(function (ceil) {
                    return ceil.x != x || ceil.y != y;
                });

                if (effective) {
                    snake.square[x][y].isFood = true;
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

            document.addEventListener('keydown', function (e) {
                var direction = e.keyCode - 37;
                if (Math.abs(direction - snake.direction) != 2) {
                    snake.direction = direction;
                    snake.move();
                }
            })
        },
        start : function () {
            snake.init();
            snake.makeFood();
            setInterval(function () {
                snake.move();
            }, snake.speed);
        }
    });

    snake.start();

    avalon.scan();




})();
