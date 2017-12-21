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
                };
            })
        },
        getBaseMark: (cube) => {
            let mark = 0;
            if (cube.z == -CUBE_WIDTH)
                mark |= CubeUtil.back;
            if (cube.z == CUBE_WIDTH)
                mark |= CubeUtil.front;
            if (cube.x == -CUBE_WIDTH)
                mark |= CubeUtil.left;
            if (cube.x == CUBE_WIDTH)
                mark |= CubeUtil.right;
            if (cube.y == -CUBE_WIDTH)
                mark |= CubeUtil.up;
            if (cube.y == CUBE_WIDTH)
                mark |= CubeUtil.bottom;
            return mark;
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
        }
    }
})();


let vm = avalon.define({
    $id: 'cube',
    cubes: CubeUtil.createCubes(),
    bg: function (index, direction) {
        const cube = vm.cubes[index];
        const mark = CubeUtil.getBaseMark(cube);
        if (mark & CubeUtil[direction]) {
            return COLOR_MAP[direction]
        }
    },
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
        if (direction === 'x') {
            cubes.forEach((cube) => {
                let count = 0;
                let x = cube.z;
                let y = cube.y;
                let tempInterval = setInterval(() => {
                    cube.rotateX += rangeDegree;
                    count++;
                    let rad = -CubeUtil.degreeToRad(count * rangeDegree);

                    cube.z = x * Math.cos(rad) - y * Math.sin(rad);
                    cube.y = x * Math.sin(rad) + y * Math.cos(rad);

                    if (count === 30) {
                        clearInterval(tempInterval);
                    }
                }, 16);
            });

        } else if (direction === 'y') {

            cubes.forEach((cube) => {
                let count = 0;
                let x = cube.x;
                let y = cube.z;
                let tempInterval = setInterval(() => {
                    cube.rotateY += rangeDegree;
                    count++;
                    let rad = -CubeUtil.degreeToRad(count * rangeDegree);

                    cube.x = x * Math.cos(rad) - y * Math.sin(rad);
                    cube.z = x * Math.sin(rad) + y * Math.cos(rad);

                    if (count === 30) {
                        clearInterval(tempInterval);
                    }
                }, 16);
            });
        } else if (direction === 'z') {

            cubes.forEach((cube) => {
                let count = 0;
                let x = cube.x;
                let y = cube.y;
                let tempInterval = setInterval(() => {
                    cube.rotateZ += rangeDegree;
                    count++;
                    let rad = CubeUtil.degreeToRad(count * rangeDegree);

                    cube.x = x * Math.cos(rad) - y * Math.sin(rad);
                    cube.y = x * Math.sin(rad) + y * Math.cos(rad);

                    if (count === 30) {
                        clearInterval(tempInterval);
                    }
                }, 16);
            });
        }

        cubes.forEach((cube) => {
            cube.x = ~~cube.x;
            cube.y = ~~cube.y;
            cube.z = ~~cube.z;
        })

    }
});
avalon.scan();
