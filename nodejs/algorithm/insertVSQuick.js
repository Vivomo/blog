/**
 * 插入排序对比快速排序
 *
 */


/**
 * 插入排序
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

/**
 * 二分搜索插入排序
 * @param arr
 */
function binarySearchInsertSort(arr) {
    for (let i = 1, l = arr.length; i < l; i++) {
        let begin = 0,
            end = i - 1,
            mid, target;

        while (end - begin > 1) {
            mid = ~~ ((begin + end) / 2);
            if (arr[i] < arr[mid]) {
                end = mid - 1;
            } else if (arr[i] > arr[mid]) {
                begin = mid + 1;
            } else {
                target = mid + 1;
                break;
            }
        }
        if (!target) {
            if (arr[i] < arr[begin]) {
                target = begin;
            } else if (arr[i] < arr[end]) {
                target = end;
            } else {
                target = end + 1;
            }
        }

        for (let j = i; j > target; j--) {
            const temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
        }
        console.log('->', arr)
    }
}

function getRandomArray(len, max=100000) {
    var arr = [];
    for (let i = 0; i < len; i++) {
        arr[i] = ~~ (Math.random() * max);
    }
    return arr;
}
//  [ 92, 46, 86, 85, 77, 7, 51, 6, 36, 40, 25, 68, 26, 28, 29, 64, 6, 72, 37, 61 ]
var arr = getRandomArray(30, 1000);

console.log('before sort', arr);
binarySearchInsertSort(arr);
console.log('after sort', arr.toString());

