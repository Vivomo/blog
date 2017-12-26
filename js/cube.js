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
            return degree * Math.PI / 180;
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

            if (num != 2) {
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
    let cube = document.getElementById('cube-box');

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

    function listenMouse(vm) {
        body.addEventListener('mousedown', (e) => {
            console.log(e, 'body');
        });

        cube.addEventListener('mousedown', (e) => {
            console.log(e, 'cube');
            e.stopPropagation();
        });
    }

    return {
        listen: function (vm) {
            listenKey(vm);
            listenMouse(vm);
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
    /**
     * 一个点绕一个圆心(0, 0)旋转后的坐标
     * 未完待续
     * x1=x0cosn-y0sinn
     * y1=x0sinn+y0cosn
     * @param direction
     * @param num
     * @param isClockwise
     */
    rotate: (direction, num, isClockwise = true) => {
        if (this.$rotating) {
            return;
        } else {
            this.$rotating = true;
        }
        let rangeDegree = isClockwise ? 3 : -3;
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

        cubes.forEach((cube, index) => {
            let count = 0;
            let _x = cube[x];
            let _y = cube[y];
            let tempInterval = setInterval(() => {
                count++;
                let rad = CubeUtil.degreeToRad(count * rangeDegree);
                if (direction !== 'z') {
                    rad = -rad;
                }

                cube[rotateDirection] += rangeDegree;
                cube[x] = _x * Math.cos(rad) - _y * Math.sin(rad);
                cube[y] = _x * Math.sin(rad) + _y * Math.cos(rad);

                if (count === 30) {
                    clearInterval(tempInterval);
                    cube[x] = _x;
                    cube[y] = _y;
                    cube[rotateDirection] = 0;
                    CubeUtil.swapColor(vm.cubes, direction, num, isClockwise);

                    if (index === 8) { // last
                        this.$rotating = false;
                    }
                }
            }, 10);
        });

    },
    /**
     * 视角旋转
     * @param direction
     * @param isClockwise
     */
    rotateVisualAngle: function (direction, isClockwise = true) {

    }

});
avalon.scan();

CubeListener.listen(vm);


