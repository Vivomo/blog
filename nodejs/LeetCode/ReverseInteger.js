/**
 *
 * Example 1:
 Input: 123
 Output: 321

 Example 2:
 Input: -123
 Output: -321

 Example 3:
 Input: 120
 Output: 21
 * Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1].
 * For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.
 * @param {number} x
 * @return {number}
 *
 */
let reverse = function(x) {
    let num = 0;
    while (x !== 0) {
        num = num * 10 + (x % 10)
        x = ~~ (x / 10)
    }
    return (num > 2147483647 || num < -2147483648) ? 0 : num;
};

/**
 * 自己在参照别人前写的蠢方法
 * @param x
 * @returns {number}
 */
let reverseStupid = function(x) {
    let arr = [];
    let isMinus = x < 0;
    if (isMinus) {
        x = -x;
    }
    while (x !== 0) {
        arr.push(x % 10)
        x = ~~ (x / 10)
    }
    let num = 0;
    let ier = 1;
    for (let i = arr.length - 1; i >= 0; i--) {
        num += arr[i] * ier;
        ier *= 10;
    }
    let result = num * (isMinus ? -1 : 1)
    if (result > 2147483647 || result < -2147483648) {
        return 0;
    }
    return result;
};

console.log(reverse(1534236469))
console.log(reverse(-321))
console.log(reverse(120))
