const factorial = (n) => {
    if (n === 0) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
/**
 * 排列 n 个不同元素 取m个 有多少种取法, m, n 必须为自然数且, m <= n
 * @param n
 * @param m
 * @returns {number}
 */
const permutation = (n, m) => {
    if (n % 1 !== 0 || m % 1 !== 0) {
        throw 'arguments must be integer'
    }
    if (n < 0 || m < 0) {
        throw 'arguments can\'t be negative number'
    }
    if (m > n) {
        return 0
    }
    let result = 1;
    for (let i = (n - m + 1); i <= n; i++) {
        result *= i;
    }
    return result;
};


/**
 * 组合 n 个不同元素 取m个 有多少种取法, m, n 必须为自然数且, m <= n
 * @param n
 * @param m
 * @returns {number}
 */
const combination = (n, m) => {
    if (n % 1 !== 0 || m % 1 !== 0) {
        throw 'arguments must be integer'
    }
    if (n < 0 || m < 0) {
        throw 'arguments can\'t be negative number'
    }
    if (m > n) {
        return 0
    }
    let result = 1;
    for (let i = (n - m + 1); i <= n; i++) {
        result *= i;
    }
    return result / factorial(m);
};

let swap = (arr, from, to) => {
    let tmp = arr[from];
    arr[from] = arr[to];
    arr[to] = tmp;
};

let reverse = (arr, start, end) => {
    while (start < end) {
        swap(arr, start, end);
        start++;
        end--;
    }
};

let nextPermutation = (arr) => {
    let len = arr.length;
    let i = len - 2;
    let j = len - 1;

    while (i >= 0 && arr[i] >= arr[i + 1]) i--;

    if (i >= 0) {
        while (j > i && arr[j] <= arr[i]) j--;
        swap(arr, i, j);
        reverse(arr, i + 1, len - 1);
    } else {
        reverse(arr, 0, len - 1);
    }
};


module.exports = {
    permutation,
    combination,
    factorial,
    nextPermutation
};