let merge = (arr1, arr2) => {
    let arr = [];
    while (arr1.length > 0 && arr2.length > 0) {
        if (arr1[0] < arr2[0]) {
            arr.push(arr1.shift());
        } else {
            arr.push(arr2.shift());
        }
    }
    return arr.concat(arr1).concat(arr2);
};

let mergeSort = (arr) => {
    if (arr.length < 2) {
        return arr;
    }
    let mid = ~~(arr.length / 2);
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)))
};

console.log(mergeSort([3, 2, 4, 7, 8, 19, 5]));