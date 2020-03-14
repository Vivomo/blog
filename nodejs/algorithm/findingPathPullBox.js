const EMPTY = 0;
const PERSON = 1;
const BOX = 0b10;
const TARGET = 0b100;
const WALL = 0b1000;


let getTargetPoints = (boxMap) => {
    let points = [];
    boxMap.forEach((line, r) => {
        line.forEach((item, c) => {
            if (item & TARGET) {
                points.push({r, c})
            }
        });
    });
    return points;
};

/**
 * 是否已解决
 * @param boxMap
 * @param points
 */
let isSolved = (boxMap, points) => points.every(({r, c}) => boxMap[r][c] & BOX);

let findingPath = (boxMap) => {
    let targetPoints = getTargetPoints(boxMap);
    console.log(targetPoints);
};