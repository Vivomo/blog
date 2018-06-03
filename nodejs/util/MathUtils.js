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
    let factorialOfM = 1;
    for (let i = 2; i <= m; i++) {
        factorialOfM *= i;
    }
    return result / factorialOfM;
};

module.export = {
    permutation,
    combination
};