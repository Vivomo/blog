const {format, getPoints, pointsToMap, getDeadPointsMap, addHistory, numToPoint, copy, pointToNum, getNextPoint,
    isIndexOutOf,
    historyContains, isSolved, formatAnswer, CONSTANTS, getPrevPoint, isDeadWay} = require('../util/pushBox');

let map = require('../pushBoxMap');


const {TARGET, BOX, PERSON, PUSHED_OPT, WALL, EMPTY} = CONSTANTS;


let isSamePoint = (p1, p2) => p1.x === p2.x && p1.y === p2.y;


let getFixedMap = boxMap => boxMap.map(line => line.map(item => item & WALL ? WALL : EMPTY));

let bfsC = 0;
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
    if (targetPoints.length !== boxLength) {
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
    let dw = 0;
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
                    if (deadPointsMap[nextNum] || _fixedMap[nextPoint.y][nextPoint.x] & WALL) {
                        continue;
                    }

                    let prevPoint = getPrevPoint(boxPoint, i);
                    let path = bfs(personPoint, prevPoint, _fixedMap, max);
                    if (!path) {
                        continue;
                    }
                    path.push(i | PUSHED_OPT);
                    let _boxNums = boxNums.concat();
                    _boxNums.splice(index, 1, nextNum);
                    let _history = {
                        opt: opt.concat(...path),
                        data: [boxNum, ..._boxNums]
                    };
                    if (isSolved(targetPointsMap, _boxNums)) {
                        answer = _history.opt;
                        console.log(bfsC);
                        console.log(dw);

                        // console.log(JSON.stringify(historyMap).length)
                        return true;
                    }

                    if (isDeadWay(boxMap, _history.data[index + 1], i)) {
                        dw++;
                        continue;
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

let boxMap = format(map.example3);

console.time('a');
console.log(findingPath(boxMap));
console.timeEnd('a')
