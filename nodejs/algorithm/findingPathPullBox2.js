const EMPTY = 1;
const PERSON = 0b10;
const BOX = 0b100;
const TARGET = 0b1000;
const WALL = 0b10000;
const SOLID = BOX | WALL;
const REMOVABLE = PERSON | BOX;
const PUSHED_OPT = 0b100;
const POINT_BIT = 5;
const POINT_COMPLEMENT = 2 ** POINT_BIT - 1;
const OPT = 0b11;

/**
 * 一个数表示坐标 8|8 x|y
 * @param boxMap
 * @param type
 * @param toNum
 * @returns {[]}
 */
let getPoints = (boxMap, type, toNum = true) => {
    let points = [];
    boxMap.forEach((line, y) => {
        line.forEach((item, x) => {
            if (item & type) {
                points.push({x, y})
            }
        });
    });
    if (toNum) {
        return points.map(pointToNum)
    }
    return points;
};

let pointsToMap = (points) => {
    let obj = {};
    points.forEach((item) => {
        obj[item] = true;
    });
    return obj;
};

let numToPoint = (point) => {
    let y = point & POINT_COMPLEMENT;
    let x = point >> POINT_BIT & POINT_COMPLEMENT;
    return {x, y};
};

let pointToNum = ({x, y}) => x << POINT_BIT | y;


let formatMap = {
    '#': WALL,
    '_': EMPTY,
    '-': EMPTY,
    ' ': EMPTY,
    '.': TARGET,
    '*': TARGET | BOX,
    '+': TARGET | PERSON,
    '$': BOX,
    '@': PERSON
};

let format = (boxMap) => {
    return boxMap.trim().split('\n').map(line => line.split('').map(item => formatMap[item]));
};

let getNextPoint = ({x, y}, direction) => {
    if (direction % 2 === 0) {
        x = x + direction - 1;
    } else {
        y = y + direction - 2;
    }
    return {x, y};
};

let getPrevPoint = ({x, y}, direction) => {
    if (direction % 2 === 0) {
        x = x - direction + 1;
    } else {
        y = y - direction + 2;
    }
    return {x, y};
};

let isSamePoint = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

/**
 * 是否已解决
 * @param pointsMap target
 * @param points
 */
let isSolved = (pointsMap, points) => points.every(point => pointsMap[point]);

let isIndexOutOf = ({x, y}, max) => x < 0 || y < 0 || x > max.x || y > max.y;

let copy = boxMap => boxMap.map(line => line.concat());

let getFixedMap = boxMap => boxMap.map(line => line.map(item => item & WALL ? WALL : EMPTY));


let addHistory = (historyMap, data) => {
    let _map = historyMap;
    data.forEach(point => {
        if (!_map[point]) {
            _map[point] = {};
        }
        _map = _map[point]
    });
};

let historyContains = (historyMap, data) => {
    let _map = historyMap;
    return data.every(point => {
        if (!_map[point]) {
            return false;
        }
        _map = _map[point];
        return true;
    });
};

let answerMap = 'lurd';

let formatAnswer = (answer) => {
    return answer.map(opt => {
        let result = answerMap[opt & OPT];
        if (opt & PUSHED_OPT) {
            result = result.toUpperCase();
        }
        return result;
    }).join('');
};


let getLineData = (boxMap, {x, y}, isX) => {
    let result = {target: true};
    if (isX) {
        let line = boxMap[y];
        for (let i = x - 1; i >= 0; i--) {
            if (line[i] & TARGET) {
                return result;
            } else if (line[i] & WALL) {
                result.start = i;
                break;
            }
        }

        for (let i = x + 1; i < boxMap[0].length; i++) {
            if (line[i] & TARGET) {
                return result;
            } else if (line[i] & WALL) {
                result.end = i;
                break;
            }
        }
    } else {
        for (let i = y - 1; i >= 0; i--) {
            if (boxMap[i][x] & TARGET) {
                return result;
            } else if (boxMap[i][x] & WALL) {
                result.start = i;
                break;
            }
        }

        for (let i = y + 1; i < boxMap.length; i++) {
            if (boxMap[i][x] & TARGET) {
                return result;
            } else if (boxMap[i][x] & WALL) {
                result.end = i;
                break;
            }
        }
    }
    result.target = false;
    return result;
};

let isDeadWall = (boxMap, lineNum, start, end, isX) => {
    let notWallCount = 0;
    if (isX) {
        for (let i = start; i <= end; i++) {
            if (!(boxMap[lineNum][i] & WALL)) {
                notWallCount++;
            }
        }
    } else {
        for (let i = start; i <= end; i++) {
            if (!(boxMap[i][lineNum] & WALL)) {
                notWallCount++;
            }
        }
    }
    return notWallCount < 2;
};

/**
 * 箱子推过去就无解的点, 包含墙
 * @param boxMap
 */
let getDeadPointsMap = (boxMap) => {
    let emptyPoints = getPoints(boxMap, EMPTY | PERSON);
    let wallPoints = getPoints(boxMap, WALL);
    let deadPointsMap = {};
    wallPoints.forEach((point) => {
        deadPointsMap[point] = true;
    });
    let max = {
        x: boxMap[0].length - 1,
        y: boxMap.length - 1
    }
    emptyPoints.forEach(pointNum => {
        let point = numToPoint(pointNum);
        let wallDirection = [];
        for (let i = 0; i < 4; i++) {
            let next = getNextPoint(point, i);
            if (isIndexOutOf(next, max)) {
                continue;
            }
            if (boxMap[next.y][next.x] & WALL) {
                wallDirection.push(i);
            }
        }
        if (wallDirection.length === 3) {
            deadPointsMap[pointNum] = true;
        } else if (wallDirection.length === 2 && wallDirection[1] - wallDirection[0] !== 2) {
            deadPointsMap[pointNum] = true;
        } else if (wallDirection.length === 1) {
            let isX = wallDirection[0] % 2 !== 0;
            let {target, start, end} = getLineData(boxMap, point, isX);
            let lineNum = (isX ? point.y - 2 : point.x - 1) + wallDirection[0];
            if (!target && isDeadWall(boxMap, lineNum, start, end, isX)) {
                deadPointsMap[pointNum] = true;
            }
        }

    });
    return deadPointsMap;
};

let bfs = (start, end, map, max) => {
    if (isSamePoint(start, end)) {
        return [];
    }

    let stack = [
        [{
            x: start.x,
            y: start.y,
            direction: []
        }]
    ];

    let blankSquare = copy(map);

    while (true) {
        let next = [];
        let last = stack[stack.length - 1];
        let find = last.some((point) => {
            for (let i = 0; i < 4; i++) {
                let nextPoint = getNextPoint(point, i);
                if (isIndexOutOf(point, max) || blankSquare[nextPoint.y][nextPoint.x] & WALL) {
                    continue;
                }
                nextPoint.direction = [...point.direction, i];
                blankSquare[nextPoint.y][nextPoint.x] = WALL;
                next.push(nextPoint);
                if (isSamePoint(end, nextPoint)) {
                    return true;
                }
            }
        });
        if (next.length === 0) {
            return null;
        }
        stack.push(next);
        if (find) {
            return stack.pop().pop().direction;
        }
    }
};

let findingPath = (boxMap) => {
    let targetPoints = getPoints(boxMap, TARGET);
    let boxPoints = getPoints(boxMap, BOX);
    let boxLength = boxPoints.length;
    if (targetPoints.length !== boxPoints.length) {
        throw '箱子与目标点数量不符合';
    }
    let targetPointsMap = pointsToMap(targetPoints);
    let deadPointsMap = getDeadPointsMap(boxMap);
    let personPoint = getPoints(boxMap, PERSON)[0];
    let fixedMap = getFixedMap(boxMap);

    let max = {
        x: boxMap[0].length - 1,
        y: boxMap.length - 1
    };
    let history = {
        opt: [],
        data: [personPoint, ...boxPoints]
    };
    let historyMap = {};
    addHistory(historyMap, history.data);

    let temp = [history];
    let answer = [];
    while (true) {
        let newTemp = [];
        let find = temp.some(({opt, data}) => {
            let [personNum, ...boxNums] = data;
            let boxPoints = boxNums.map(numToPoint);
            let personPoint = numToPoint(personNum);
            let _fixedMap = copy(fixedMap);
            boxPoints.forEach(({x, y}) => {
                _fixedMap[y][x] = WALL;
            });

            for (let index = 0; index < boxLength; index++) {
                let boxPoint = boxPoints[index];
                let boxNum = pointToNum(boxPoint);

                for (let i = 0; i < 4; i++) {
                    let nextPoint = getNextPoint(boxPoint, i);
                    let nextNum = pointToNum(nextPoint);
                    if (deadPointsMap[nextNum]) {
                        continue;
                    }

                    let prevPoint = getPrevPoint(boxPoint, i);
                    let path = bfs(personPoint, prevPoint, _fixedMap, max);
                    if (!path) {
                        continue;
                    }
                    path.push(i);
                    let _boxNums = boxNums.concat();
                    _boxNums.splice(index, 1, nextNum);
                    let _history = {
                        opt: opt.concat(...path),
                        data: [boxNum, ..._boxNums]
                    };
                    if (isSolved(targetPointsMap, _boxNums)) {
                        answer = _history.opt;
                        return true;
                    }

                    if (!historyContains(historyMap, _boxNums)) {
                        newTemp.push(_history);
                        addHistory(historyMap, _history.data);
                    }
                }
            }

        });
        if (find) {
            break;
        }
        if (newTemp.length === 0) {
            throw '无解';
        }
        temp = newTemp;
    }
    return formatAnswer(answer);
};

let example1 = `
####__
#-.#__
#--###
#*@--#
#--$-#
#--###
####__
`;

let example2 = `
_######
##--.-#
#-*-#-#
#-.$--#
#--#$##
##-@-#_
_#####_
`;

let example3 = `
#######
#.----#
#*#---#
#.*-$-#
#.$$$-#
#.#@--#
#######
`;
let example4 = `
#######
#.-.-.#
#-$$$-#
#.$@$.#
#-$$$-#
#.-.-.#
#######
`;

let example5 = `
########
##----##
#-$-$$-#
#......#
#-$$-$-#
###-@###
########
`;
let boxMap = format(example1);
// let a = getDeadPointsMap(boxMap);
// for (let k in a) {
//     console.log(numToPoint(~~k))
// }
console.time('a');
console.log(findingPath(boxMap));
console.timeEnd('a')
