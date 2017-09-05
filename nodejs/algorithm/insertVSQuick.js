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
        for (let j = 0; j < i; j++) {
            if (arr[i] < arr[j]) {
                let temp = arr[i];
                let _i = i;
                while (j < _i--) {
                    arr[i+1] = arr[i];
                }
                arr[j] = temp;
                break;
            }
        }
    }
}

