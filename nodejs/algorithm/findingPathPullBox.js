const EMPTY = 0;
const PERSON = 1;
const BOX = 0b10;
const TARGET = 0b100;
const WALL = 0b1000;
const SOLID = BOX | WALL;

let getTargetPoints = (boxMap) => {
    let points = [];
    boxMap.forEach((line, x) => {
        line.forEach((item, y) => {
            if (item & TARGET) {
                points.push({x, y})
            }
        });
    });
    return points;
};

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

let move = ({person, data}, direction, max) => {
    let next = getNextPoint(person, direction);
    if (isIndexOutOf(next, max)) {
        return;
    }
    let nextItem = data[next.y][next.x];
    if (nextItem & WALL) {
        return;
    }

    let copyData;
    if (nextItem & BOX) {
        let next2 = getNextPoint(next, direction);
        let next2Item = data[next2.y][next2.x];
        if (next2Item & SOLID) {
            return;
        }
        copyData = copy(data);
        moveTo(copyData, next, next2);
    }
    copyData = copyData || copy(data);
    moveTo(copyData, person, next);
    return {
        data: copyData,
        person: next
    }
};

let moveTo = (boxMap, from, to) => {
    let type = boxMap[from.y][from.x] & PERSON ? PERSON : BOX;
    boxMap[from.y][from.x] ^= type;
    boxMap[to.y][to.x] |= type;
};

/**
 * 获取人的坐标
 * @param boxMap
 * @returns {{x: *, y: *}}
 */
let getPersonPoint = (boxMap) => {
    let x = -1, y = -1;
    boxMap.some((line, rIndex) => {
        return line.some((item, cIndex) => {
            if (item & PERSON) {
                x = rIndex;
                y = cIndex;
                return true;
            }
        })
    });
    return {x, y};
};

let findingPath = (boxMap) => {
    let targetPoints = getTargetPoints(boxMap);
    let personPoint = getPersonPoint(boxMap);
    let max = {
        x: boxMap[0].length - 1,
        y: boxMap.length - 1
    };
    let history = {
        person: personPoint,
        data: boxMap,
    };
    let historyList = [history];
    let temp = [history];
    let count = 0;

    while (true) {
        count ++;
        if (count > 100000) {
            // safe
            break;
        }
        temp.forEach((bm) => {
            for (let i = 0; i < 4; i++) {
                let _history = move(history, i, max);
            }
        });
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
