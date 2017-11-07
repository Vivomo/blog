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

function swap(arr, index1, index2) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

Object.assign(exports, {
    getRandomArr,
    swap
});

