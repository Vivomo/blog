const {format, getPoints, pointsToMap, getDeadPointsMap, getFixedMap, addHistory, isNegativeDirection,
    move, isDeadWay, historyContains, isSolved, formatAnswer, CONSTANTS} = require('../util/pushBox');

const {TARGET, BOX, PERSON, PUSHED_OPT, OPT} = CONSTANTS;

let findingPath = (boxMap) => {
    let targetPoints = getPoints(boxMap, TARGET);
    let boxPoints = getPoints(boxMap, BOX);
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
        opt: [NaN],
        data: [personPoint, ...boxPoints]
    };
    let historyMap = {};
    addHistory(historyMap, history.data);

    let temp = [history];
    let answer = [];
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
                    // console.log(JSON.stringify(historyMap).length)
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
