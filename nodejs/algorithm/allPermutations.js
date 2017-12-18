// const {swap} = require('../util/arrUtil');

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
    const s = new Set;
    arr.forEach((item) => {
        s.add(elem + item);
        for (let i = 0, l = item.length; i < l; i++) {
            if (item[i] !== elem) {
                s.add(strInsertChar(item, elem, i));
            }
        }
    });
    return [...s];
}

function strInsertChar(str, char, index) {
    return str.substring(0, index + 1) + char + str.substr(index + 1);
}

allPermutations(2, 2);
