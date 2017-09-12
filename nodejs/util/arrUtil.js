/**
 * 一些生成数组的方法
 */

function getRandomArr(len, min = 0, max = 10000) {
    let arr = [];
    let diff = max - min;
    for (let i = 0; i < len; i++) {
        arr.push(min + ~~(Math.random() * diff))
    }
    return arr;
}

exports.getRandomArr = getRandomArr;
