const EMPTY = 0;
const PERSON = 1;
const BOX = 0b10;
const TARGET = 0b100;
const WALL = 0b1000;
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

let move = (fixedMap, {opt, data: [person, ...boxes]}, direction, max) => {
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
        if (boxes.includes(next2NumPoint)) {
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
    let wallCount = 0;
    for (let i = 0; i < 4; i++) {
        if (isNegativeDirection(from, i)) {
            continue;
        }
        let next = getNextPoint(point, i);
        if (boxMap[next.y][next.x] & WALL) {
            wallCount ++
        }
    }
    return wallCount >= 2;
};

let findingPath = (boxMap) => {
    let targetPoints = getPoints(boxMap, TARGET);
    let boxPoints = getPoints(boxMap, BOX);
    if (targetPoints.length !== boxPoints.length) {
        throw '箱子与目标点数量不符合';
    }
    let targetPointsMap = pointsToMap(targetPoints);
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
    let count = 0;
    let answer = [];
    while (true) {
        count ++;
        if (count > 10000000) {
            console.log('safe break');
            // safe
            break;
        }
        let newTemp = [];
        let find = temp.some((item) => {
            for (let i = 0; i < 4; i++) {
                let prevOpt = item.opt[item.opt.length - 1];
                if (isNegativeDirection(prevOpt & OPT, i) && !(prevOpt & PUSHED_OPT)) {
                    // 与上一步相反, 且没有推箱子, 则此移动为无效移动
                    continue;
                }
                let _history = move(fixedMap, item, i, max);
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
__######
_##--.-#
_#-*-#-#
_#-.$--#
_#--#$##
_##-@-#_
__#####_
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

let boxMap = format(example1);
console.time('a');
console.log(findingPath(boxMap));
console.timeEnd('a')
