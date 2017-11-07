const arrUtils = require('../util/arrUtil');
const getRandomArr = arrUtils.getRandomArr;
const swap = arrUtils.swap;


function getArrMid(arr) {
    let mark = 0;
    const len = arr.length;
    let start = 0;
    let end = len - 1;
    const half = ~~(len / 2);
    while (true) {
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                mark = i + 1;
                swap(arr, i, i + 1);
            }
        }
        if (mark > half) {
            end = mark - 1;
        } else if (mark < half) {
            start = mark + 1;
        } else {
            return arr[half];
        }
    }
}


const arr = getRandomArr(21, 150, 200);
const cloneArr = [...arr].sort((a, b) => a - b);

console.log('mid is', getArrMid(arr));
console.log('排序验证', cloneArr[~~(cloneArr.length / 2)]);