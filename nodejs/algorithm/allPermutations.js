const {swap} = require('../util/arrUtil');

/**
 *
 * 全排列
 *
 * 一个字符串有x个1 和 y个0, 列出所有组合
 */

function allPermutations(x, y){
    let arr = [new Array(x).fill('1').join('')];

    for (let i = 0; i < y; i++) {
        arr = getInsertedArr(arr, '0');
    }

    arr.forEach(item => console.log(item));
}

function getInsertedArr(arr, elem) {
    const result = [];
    arr.forEach((item) => {
        result.push(elem + item);
        for (let i = 0, l = item.length; i < l; i++) {
            if (item[i] !== elem) {
                result.push(item.substring(0, i + 1) + elem + item.substr(i + 1));
            }
        }
    });
    return result;
}

allPermutations(2, 2);
