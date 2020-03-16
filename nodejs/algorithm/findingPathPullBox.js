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
 * @returns {[]}
 */
let getPoints = (boxMap, type) => {
    let points = [];
    boxMap.forEach((line, y) => {
        line.forEach((item, x) => {
            if (item & type) {
                points.push(pointToNum({x, y}))
            }
        });
    });
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

/**
 * 是否已解决
 * @param pointsMap target
 * @param points
 */
let isSolved = (pointsMap, points) => points.every(point => pointsMap[point]);

let isIndexOutOf = ({x, y}, max) => x < 0 || y < 0 || x > max.x || y > max.y;

let copy = boxMap => boxMap.map(line => line.concat());

let getFixedMap = boxMap => boxMap.map(line => line.map(item => item ^ REMOVABLE));

let join = (boxMap, points, type) => {
    points.forEach((point) => {
        let {x, y} = numToPoint(point);
        boxMap[y][x] |= type;
    });
    return boxMap;
};

let move = (fixedMap, {opt, data: [person, ...boxes]}, direction, max, deadPointsMap) => {
    person = numToPoint(person);
    let next = getNextPoint(person, direction);
    if (isIndexOutOf(next, max)) {
        return;
    }
    if (fixedMap[next.y][next.x] & WALL) {
        return;
    }

    let nextNumPoint = pointToNum(next);
    let boxIndex = boxes.indexOf(nextNumPoint);
    if (boxIndex !== -1) {
        let next2 = getNextPoint(next, direction);
        if (fixedMap[next2.y][next2.x] & WALL) {
            return;
        }
        let next2NumPoint = pointToNum(next2);
        if (boxes.includes(next2NumPoint) || deadPointsMap[next2NumPoint]) {
            return;
        }
        direction |= PUSHED_OPT;
        boxes.splice(boxIndex, 1, next2NumPoint);
    }
    let history = {opt: [...opt, direction], data: [nextNumPoint, ...boxes]};
    if (boxIndex !== -1) {
        history.movedBoxIndex = boxIndex;
    }
    return history;
};

let moveTo = (boxMap, from, to) => {
    let type = boxMap[from.y][from.x] & PERSON ? PERSON : BOX;
    boxMap[from.y][from.x] ^= type;
    boxMap[to.y][to.x] |= type;
};

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

let isNegativeDirection = (d1, d2) => Math.abs(d1 - d2) === 2;


let isDeadWay = (boxMap, box, from) => {
    let point = numToPoint(box);
    let {x, y} = point;
    if (boxMap[y][x] & TARGET) {
        return false;
    }
    let next = getNextPoint(point, from);
    if (boxMap[next.y][next.x] & WALL) {
        let left = getNextPoint(point, (from + 3) % 4);
        let right = getNextPoint(point, (from + 1) % 4);
        if ((boxMap[left.y][left.x] & WALL) || (boxMap[right.y][right.x] & WALL)) {
            return true;
        }
        let leftTop = getNextPoint(left, from);
        if ((boxMap[left.y][left.x] & BOX) && boxMap[leftTop.y][leftTop.x] & SOLID) {
            return true;
        }
        let RightTop = getNextPoint(right, from);
        if ((boxMap[right.y][right.x] & BOX) && boxMap[RightTop.y][RightTop.x] & SOLID) {
            return true;
        }
    }
    return false;
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

let getDeadPointsMap = (boxMap) => {
    let emptyPoints = getPoints(boxMap, EMPTY | PERSON);
    let deadPointsMap = {};
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

let findingPath = (boxMap) => {
    let targetPoints = getPoints(boxMap, TARGET);
    let boxPoints = getPoints(boxMap, BOX);
    if (targetPoints.length !== boxPoints.length) {
        throw '箱子与目标点数量不符合';
    }
    let targetPointsMap = pointsToMap(targetPoints);
    let deadPointsMap = getDeadPointsMap(boxMap)
    let personPoint = getPoints(boxMap, PERSON)[0];
    let fixedMap = getFixedMap(boxMap);

    let max = {
        x: boxMap[0].length - 1,
        y: boxMap.length - 1
    };
    let history = {
        opt: [NaN],
        data: [personPoint, ...boxPoints]
    };
    let historyMap = {};
    addHistory(historyMap, history.data);

    let temp = [history];
    let answer = [];
    let deadWayCount = 0;
    while (true) {
        let newTemp = [];
        let find = temp.some((item) => {
            for (let i = 0; i < 4; i++) {
                let prevOpt = item.opt[item.opt.length - 1];
                if (isNegativeDirection(prevOpt & OPT, i) && !(prevOpt & PUSHED_OPT)) {
                    // 与上一步相反, 且没有推箱子, 则此移动为无效移动
                    continue;
                }
                let _history = move(fixedMap, item, i, max, deadPointsMap);
                if (!_history) {
                    continue;
                }
                if (isSolved(targetPointsMap, _history.data.slice(1))) {
                    answer = _history.opt.slice(1);
                    return true;
                }

                if (_history.movedBoxIndex !== undefined &&
                    isDeadWay(boxMap, _history.data[_history.movedBoxIndex + 1], i)) {
                    continue;
                }
                if (!historyContains(historyMap, _history.data)) {
                    newTemp.push(_history);
                    addHistory(historyMap, _history.data);
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

let boxMap = format(example3);
let a = getDeadPointsMap(boxMap);
for (let k in a) {
    console.log(numToPoint(~~k))
}
console.time('a');
console.log(findingPath(boxMap));
console.timeEnd('a')
