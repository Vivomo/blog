const EMPTY = 0;
const PERSON = 1;
const BOX = 0b10;
const TARGET = 0b100;
const WALL = 0b1000;
const SOLID = BOX | WALL;
const REMOVABLE = PERSON | BOX;

/**
 * 一个数表示坐标 8|8 x|y
 * @param boxMap
 * @param type
 * @returns {[]}
 */
let getPoints = (boxMap, type) => {
    let points = [];
    boxMap.forEach((line, x) => {
        line.forEach((item, y) => {
            if (item & type) {
                points.push(pointToNum({x, y}))
            }
        });
    });
    return points;
};

let numToPoint = (point) => {
    let y = point & 0b11111111;
    let x = point >> 8 & 0b11111111;
    return {x, y};
};

let pointToNum = ({x, y}) => x << 8 | y;


let formatMap = {
    '#': WALL,
    '-': EMPTY,
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
 * @param boxMap
 * @param points
 */
let isSolved = (boxMap, points) => points.every(({x, y}) => boxMap[x][y] & BOX);

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

let move = (fixedMap, [opt, person, ...boxes], direction, max) => {
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
        boxes.split(boxIndex, 1, nextNumPoint);
    }

    return [[...opt, direction], nextNumPoint, ...boxes];
};

let moveTo = (boxMap, from, to) => {
    let type = boxMap[from.y][from.x] & PERSON ? PERSON : BOX;
    boxMap[from.y][from.x] ^= type;
    boxMap[to.y][to.x] |= type;
};


let findingPath = (boxMap) => {
    let targetPoints = getPoints(boxMap, TARGET);
    let boxPoints = getPoints(boxMap, BOX);
    let personPoint = getPoints(boxMap, PERSON)[0];
    let fixedMap = getFixedMap(boxMap);

    let max = {
        x: boxMap[0].length - 1,
        y: boxMap.length - 1
    };
    let history = [[], personPoint, ...boxPoints];
    let historyList = [history];
    let temp = [history];
    let count = 0;

    while (true) {
        count ++;
        if (count > 100000) {
            // safe
            break;
        }
        let newTemp = [];
        temp.forEach((item) => {
            for (let i = 0; i < 4; i++) {
                let _history = move(fixedMap, item, i, max);
                if (!_history) {
                    continue;
                }
                newTemp.push(_history);
            }
        });
        temp = newTemp;
    }
};

let example = `
####--
#-*#--
#-@###
#*---#
#----#
#--###
####--
`;

let boxMap = format(example);
// console.log(getPersonPoint(boxMap));
