/**
 *
 * 获取 数组中连续片段的最大和
 */

const arrUtils = require('../util/arrUtil');
const getRandomArr = arrUtils.getRandomArr;

/**
 * 简单算法
 * @param arr
 */
function simple(arr) {
    let max = 0;
    let begin = 0;
    let end = 0;
    for (let i = 0, l = arr.length; i < l; i++ ) {
        let sum = 0;
        for (let j = i; j < l; j++) {
            sum += arr[j];
            if (sum > max) {
                max = sum;
                begin = i;
                end = j;
            }
            console.log(i, j, '->', sum);
        }
    }
    console.log(begin, end, max);
    return max;
}

let arr = getRandomArr(10, -100, 100);
console.log(simple(arr));