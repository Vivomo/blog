avalon.config({
    interpolate: ["[[","]]"]
});

const COLOR_MAP = {
    up: 'yellow',
    bottom: 'white',
    left: 'orange',
    right: 'red',
    front: 'blue',
    back: 'green'
};
const CUBE_WIDTH = 100;
const A_DEGREE_RAD = Math.PI / 180;

const CubeUtil = (() => {
    const front = 32,
        back = 16,
        up = 8,
        bottom = 4,
        left = 2,
        right = 1,

    indexMap = {
        x: {
            direction: ['back', 'bottom', 'front', 'up'],
            side: {
                '1': 'left',
                '3': 'right'
            },
            '1': [
                // for swap color
                [0, 3, 6],
                [6, 15, 24],
                [24, 21, 18],
                [18, 9, 0]
            ],
            '2': [
                [1, 4, 7],
                [7, 16, 25],
                [25, 22, 19],
                [19, 10, 1]
            ],
                '3': [
                [2, 5, 8],
                [8, 17, 26],
                [26, 23, 20],
                [20, 11, 2]
            ],
        },
        y: {
            direction: ['back', 'left', 'front', 'right'],
            side: {
                '1': 'up',
                '3': 'bottom'
            },
            '1': [
                [0, 1, 2],
                [18, 9, 0],
                [20, 19, 18],
                [2, 11, 20],
            ],
            '2': [
                [3, 4, 5],
                [21, 12, 3],
                [23, 22, 21],
                [5, 14, 23],
            ],
            '3': [
                [6, 7, 8],
                [24, 15, 6],
                [26, 25, 24],
                [8, 17, 26],
            ],
        },
        z: {
            direction: ['up', 'right', 'bottom', 'left'],
            side: {
                '1': 'back',
                '3': 'front'
            },
            '1': [
                [0, 1, 2],
                [2, 5, 8],
                [8, 7, 6],
                [6, 3, 0]
            ],
            '2': [
                [9, 10, 11],
                [11, 14, 17],
                [17, 16, 15],
                [15, 12, 9]
            ],
            '3': [
                [18, 19, 20],
                [20, 23, 26],
                [26, 25, 24],
                [24, 21, 18]
            ],
        }
    };

    return {
        front,
        back,
        up,
        bottom,
        left,
        right,
        indexMap,
        xDirection: [front, up, back, bottom],
        yDirection: [front, left, back, right],
        zDirection: [up, right, bottom, left],

        createCubes: function() {
            return avalon.range(0, 27).map((index) => {
                let x = (index % 3 - 1) * CUBE_WIDTH,
                    y = ~~(index % 9 / 3) * CUBE_WIDTH - CUBE_WIDTH,
                    z = ~~(index / 9) * CUBE_WIDTH - CUBE_WIDTH,

                    originX = this.getCubeOrigin(x),
                    originY = this.getCubeOrigin(y),
                    originZ = this.getCubeOrigin(z, true, index);

                return {
                    index,
                    x,
                    y,
                    z,
                    originX,
                    originY,
                    originZ,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    bg: {
                        left: '',
                        right: '',
                        up: '',
                        bottom: '',
                        front: '',
                        back: ''
                    }
                };
            })
        },
        getCubeOrigin: (translate, isZ = false, index) => {
            if (isZ) {
                return index < 9 ? CUBE_WIDTH :
                    index < 18 ? 0 : -CUBE_WIDTH;
            }
            return -translate + CUBE_WIDTH / 2;
        },
        degreeToRad: function (degree) {
            return degree * A_DEGREE_RAD;
        },
        paint: function (cubes) {
            cubes.filter(cube => cube.z === -CUBE_WIDTH).forEach(cube => cube.bg.back = COLOR_MAP.back);
            cubes.filter(cube => cube.z === CUBE_WIDTH).forEach(cube => cube.bg.front = COLOR_MAP.front);
            cubes.filter(cube => cube.x === -CUBE_WIDTH).forEach(cube => cube.bg.left = COLOR_MAP.left);
            cubes.filter(cube => cube.x === CUBE_WIDTH).forEach(cube => cube.bg.right = COLOR_MAP.right);
            cubes.filter(cube => cube.y === -CUBE_WIDTH).forEach(cube => cube.bg.up = COLOR_MAP.up);
            cubes.filter(cube => cube.y === CUBE_WIDTH).forEach(cube => cube.bg.bottom = COLOR_MAP.bottom);
            return cubes;
        },
        /**
         * 颜色转换, (可优化空间: indexArr的多次遍历)
         * @param cubes
         * @param direction
         * @param num
         * @param isClockwise
         */
        swapColor: function (cubes, direction, num, isClockwise) {
            let indexGroup = indexMap[direction];
            let indexArr = indexGroup[num];
            let directionArr = indexGroup.direction;

            let colorMap = indexArr.map((arr, outerIndex) => {
                return arr.map(cubeIndex => cubes[cubeIndex].bg[directionArr[outerIndex]]);
            });
            if (isClockwise) {
                colorMap.unshift(colorMap.pop());
            } else {
                colorMap.push(colorMap.shift());
            }

            if (num !== 2) {
                let sideDirection = indexGroup.side[num];
                let sideColorMap = indexArr.map((arr) => {
                    return arr.map(cubeIndex => cubes[cubeIndex].bg[sideDirection]);
                });
                if (isClockwise) {
                    sideColorMap.unshift(sideColorMap.pop());
                } else {
                    sideColorMap.push(sideColorMap.shift());
                }
                indexArr.forEach((arr, outerIndex) => {
                    arr.forEach((cubeIndex, index) => {
                        cubes[cubeIndex].bg[sideDirection] = sideColorMap[outerIndex][index];
                    })
                });
            }
            indexArr.forEach((arr, outerIndex) => {
                arr.forEach((cubeIndex, index) => {
                    cubes[cubeIndex].bg[directionArr[outerIndex]] = colorMap[outerIndex][index];
                })
            });
        },
    }
})();

const CubeListener = (function () {

    let body = document.body;
    let bodyWidth = body.getBoundingClientRect().width;
    let cube = document.getElementById('cube-box');
    let startX = 0;
    let startY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const MIN_DISTANCE = 50; // 最小移动距离


    /**
     * 监听键盘1-9 + alt 来驱动cube所有方向的旋转
     * @param vm
     */
    function listenKey(vm) {
        body.addEventListener('keydown', (e) => {
            let keyCode = e.keyCode;
            if (keyCode < 58) {
                keyCode -= 48
            } else {
                keyCode -= 96;
            }
            if (keyCode < 1 || keyCode > 9) { // not number
                return;
            }
            let direction = 'xyz'[Math.ceil(keyCode / 3) - 1];
            let num = (keyCode - 1) % 3 + 1;
            vm.rotate(direction, num, !e.altKey);
        });
    }

    function onBodyMouseMove(e) {
        let {pageX, pageY} = e;
        mouseX = pageX;
        mouseY = pageY;
    }

    function onBodyTouchMove(e) {
        let {pageX, pageY} = e.touches[0];
        mouseX = pageX;
        mouseY = pageY;
        e.preventDefault();
    }

    function onBodyTouchEnd() {
        let changedX = Math.abs(mouseX - startX);
        let changedY = Math.abs(mouseY - startY);
        if (changedX > changedY) {
            if (changedX < MIN_DISTANCE) {
                return;
            }
            vm.rotateVisualAngle('y', mouseX > startX)
        } else {
            if (changedY < MIN_DISTANCE) {
                return;
            }
            let isX = startX < bodyWidth / 2;
            vm.rotateVisualAngle( isX ? 'x' : 'z', isX ? mouseY < startY : mouseY > startY);
        }
        body.removeEventListener('mousemove', onBodyMouseMove);
        body.removeEventListener('touchmove', onBodyTouchMove);
    }

    function listenMouse(vm) {
        body.addEventListener('mousedown', (e) => {
            mouseX = startX = e.pageX;
            mouseY = startY = e.pageY;
            body.addEventListener('mousemove', onBodyMouseMove);
        });

        body.addEventListener('touchstart', (event) => {
            let e = event.touches[0];
            mouseX = startX = e.pageX;
            mouseY = startY = e.pageY;
            body.addEventListener('touchmove', onBodyTouchMove);
        });

        body.addEventListener('touchend', onBodyTouchEnd);

        body.addEventListener('mouseup', onBodyTouchEnd);

        cube.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }

    return {
        listen: function (vm) {
            listenKey(vm);
            listenMouse(vm);

            [...document.querySelectorAll('.method-wrap button')].forEach(function (button) {
                button.addEventListener('click', function () {
                    vm.rotateMethod(Method[this.dataset.method])
                });
            });

            document.body.addEventListener('mouseup', () => {
                document.body.removeEventListener('mousemove', vm.eventMove);
            });

        }
    }
})();


let vm = avalon.define({
    $id: 'cube',
    cubes: CubeUtil.paint(CubeUtil.createCubes()),
    visualAngle: {
        x: 0,
        y: 0,
        z: 0
    },
    $rotating: false,
    rotatingVisualAngle: false,
    $startX: 0,
    $startY: 0,
    $activeCube: null,
    $activeDirection: null,
    /**
     * 一个点绕一个圆心(0, 0)旋转后的坐标
     * 未完待续
     * x1=x0cosn-y0sinn
     * y1=x0sinn+y0cosn
     * @param direction
     * @param num
     * @param isClockwise
     * @param async 是否是异步旋转, 默认false, 旋转未停止时调用rotate无效
     */
    rotate: (direction, num, isClockwise, async = false) => {
        if (this.$rotating) {
            if (!async) {
                return;
            }
        } else {
            this.$rotating = true;
        }
        let rotateStep = 20;
        let rangeDegree = (isClockwise ? 90 : -90) / rotateStep;

        let cubes = vm.cubes.filter((cube) => {
            return (cube[direction] + CUBE_WIDTH * 2) / CUBE_WIDTH === num;
        });
        let x = 'x', y = 'y';
        let rotateDirection = 'rotate' + direction.toUpperCase();
        if (direction === 'x') {
            x = 'z';
        } else if (direction === 'y') {
            y = 'z';
        }

        let count = 0;
        cubes.forEach((cube) => {
            cube._x = cube[x];
            cube._y = cube[y];
        });

        let _rotate = () => {
            if (count < rotateStep) {
                count++;
                let rad = CubeUtil.degreeToRad(count * rangeDegree);
                if (direction !== 'z') {
                    rad = -rad;
                }

                cubes.forEach((cube) => {
                    let _x = cube._x;
                    let _y = cube._y;

                    cube[rotateDirection] += rangeDegree;
                    cube[x] = _x * Math.cos(rad) - _y * Math.sin(rad);
                    cube[y] = _x * Math.sin(rad) + _y * Math.cos(rad);
                });
                requestAnimationFrame(_rotate);
            } else {
                requestAnimationFrame(() => {
                    cubes.forEach((cube, index) => {
                        cube[x] = cube._x;
                        cube[y] = cube._y;
                        cube[rotateDirection] = 0;
                    });
                    CubeUtil.swapColor(vm.cubes, direction, num, isClockwise);
                    this.$rotating = false;
                });
            }
        };

        requestAnimationFrame(_rotate);

    },

    rotateMethod: (method, time = 1000) => {
        let index = 0;
        let interval = setInterval(() => {
            vm.rotate(...method[index++]);
            if (index === method.length) {
                clearInterval(interval);
            }
        }, time);
    },
    /**
     * 视角旋转
     * @param direction
     * @param isClockwise
     */
    rotateVisualAngle: function (direction, isClockwise = true) {
        let rangeDegree = isClockwise ? 90 : -90;
        this.visualAngle[direction] += rangeDegree;

        setTimeout(() => {
            this.rotatingVisualAngle = true;
            this.visualAngle[direction] = 0;
            CubeUtil.swapColor(this.cubes, direction, 1, isClockwise);
            CubeUtil.swapColor(this.cubes, direction, 2, isClockwise);
            CubeUtil.swapColor(this.cubes, direction, 3, isClockwise);
            setTimeout(() => {
                this.rotatingVisualAngle = false;
            }, 30);
        }, 300);
    },

    eventMove: function(e) {
        let diffX = e.pageX - vm.$startX;
        let diffY = e.pageY - vm.$startY;
        let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (distance > 80) {
            vm.checkRotateDirection(diffX, diffY);
            document.body.removeEventListener('mousemove', vm.eventMove);
        }
        e.stopPropagation();
    },

    checkRotateDirection: function(xDistance, yDistance) {
        let index = vm.$activeCube.index;
        let isX = Math.abs(xDistance) > Math.abs(yDistance);
        let isClockwise;
        let direction = 'y';
        let num = 3;
        switch (vm.$activeDirection) {
            case 'front':
                if (isX) {
                    isClockwise = xDistance > 0;
                    if ([0, 1, 2, 0, 10, 11, 18, 19, 20].includes(index)) {
                        num = 1;
                    } else if ([3, 4, 5, 12, 13, 14, 21, 22, 23].includes(index)) {
                        num = 2;
                    }
                } else {
                    direction = 'x';
                    isClockwise = yDistance < 0;
                    if ([0, 9, 18, 21, 24].includes(index)) {
                        num = 1;
                    } else if ([1, 10, 19, 22, 25].includes(index)) {
                        num = 2;
                    }
                }
                break;
            case 'right':
                if (isX) {
                    isClockwise = xDistance > 0;
                    if ([0, 1, 2, 0, 10, 11, 18, 19, 20].includes(index)) {
                        num = 1;
                    } else if ([3, 4, 5, 12, 13, 14, 21, 22, 23].includes(index)) {
                        num = 2;
                    }
                } else {
                    direction = 'z';
                    isClockwise = yDistance > 0;
                    if ([2, 5, 8].includes(index)) {
                        num = 1;
                    } else if ([11, 14, 17].includes(index)) {
                        num = 2;
                    }
                }
                break;
            case 'up':
                if (xDistance > 0) {
                    if (yDistance > 0) {
                        isClockwise = true;
                        direction = 'z';
                        if ([0, 1, 2].includes(index)) {
                            num = 1;
                        } else if ([9, 10, 11].includes(index)) {
                            num = 2;
                        }
                    } else {
                        //
                        direction = 'x';
                        isClockwise = true;
                        if ([0, 9, 18].includes(index)) {
                            num = 1;
                        } else if ([1, 10, 19].includes(index)) {
                            num = 2;
                        }
                    }
                } else {
                    if (yDistance > 0) {
                        isClockwise = false;
                        direction = 'x';
                        if ([0, 9, 18].includes(index)) {
                            num = 1;
                        } else if ([1, 10, 19].includes(index)) {
                            num = 2;
                        }
                    } else {
                        direction = 'z';
                        isClockwise = false;
                        if ([0, 1, 2].includes(index)) {
                            num = 1;
                        } else if ([9, 10, 11].includes(index)) {
                            num = 2;
                        }
                    }
                }
                break;
        }
        vm.rotate(direction, num, isClockwise);
    },

    mousedown: function (cube, direction, e) {
        vm.$startX = e.pageX;
        vm.$startY = e.pageY;
        vm.$activeCube = cube;
        vm.$activeDirection = direction;

        document.body.addEventListener('mousemove', vm.eventMove);

    }
});
avalon.scan();

CubeListener.listen(vm);


let Method = {
    leftFish: [
        ['z', 3, true],
        ['y', 1, true],
        ['y', 1, true],
        ['z', 3, false],
        ['y', 1, true],
        ['z', 3, true],
        ['y', 1, true],
        ['z', 3, false],
    ],
    rightFish: [
        ['x', 3, false],
        ['y', 1, false],
        ['y', 1, false],
        ['x', 3, true],
        ['y', 1, false],
        ['x', 3, false],
        ['y', 1, false],
        ['x', 3, true]
    ],
    l: [
        ['z', 3, true],
        ['x', 3, false],
        ['z', 3, true],
        ['x', 1, true],
        ['x', 1, true],
        ['z', 3, false],
        ['x', 3, true],
        ['z', 3, true],
        ['x', 1, true],
        ['x', 1, true],
        ['z', 3, false],
        ['z', 3, false]
    ],
    //Three inverse Sangem
    tis: [
        ['x', 3, false],
        ['y', 1, true],
        ['z', 3, false],
        ['y', 1, false],
        ['z', 3, true],
        ['x', 3, true]
    ]
};

