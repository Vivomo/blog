/**
 * 插入排序对比快速排序
 *
 */


/**
 * 二分搜索插入排序
 * @param arr
 */
function insertSort(arr){
    for (let i = 1, l = arr.length; i < l; i++) {
        for (let j = i; j > 0; j--) {
            if (arr[j] < arr[j-1]) {
                const temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            } else {
                break;
            }
        }
    }
}

function getRandomArray(len, max=100000) {
    var arr = [];
    for (let i = 0; i < len; i++) {
        arr[i] = ~~ (Math.random() * max);
    }
    return arr;
}

var arr = getRandomArray(20);

console.log('before sort', arr);
insertSort(arr);
console.log('after sort', arr);
