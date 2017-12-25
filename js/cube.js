avalon.config({
    interpolate: ["[[","]]"]
});
Math.radian = function (degree) {
    return degree * Math.PI / 180;
};

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
        right = 1;
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
        }
    }
})();


let vm = avalon.define({
    $id: 'cube',
    cubes: CubeUtil.paint(CubeUtil.createCubes()),
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

        cubes.forEach((cube) => {
            let count = 0;
            let _x = cube[x];
            let _y = cube[y];
            let tempInterval = setInterval(() => {
                cube[rotateDirection] += rangeDegree;
                count++;
                let rad = CubeUtil.degreeToRad(count * rangeDegree);
                if (direction !== 'z') {
                    rad = -rad;
                }
                cube[x] = _x * Math.cos(rad) - _y * Math.sin(rad);
                cube[y] = _x * Math.sin(rad) + _y * Math.cos(rad);

                if (count === 30) {
                    clearInterval(tempInterval);
                }
            }, 16);
        });

        cubes.forEach((cube) => {
            cube.x = ~~cube.x;
            cube.y = ~~cube.y;
            cube.z = ~~cube.z;
        })

    }
});
avalon.scan();
