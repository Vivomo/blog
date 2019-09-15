/**
 You are climbing a stair case. It takes n steps to reach to the top.

 Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

 Note: Given n will be a positive integer.

 Example 1:

 Input: 2
 Output: 2
 Explanation: There are two ways to climb to the top.
 1. 1 step + 1 step
 2. 2 steps
 Example 2:

 Input: 3
 Output: 3
 Explanation: There are three ways to climb to the top.
 1. 1 step + 1 step + 1 step
 2. 1 step + 2 steps
 3. 2 steps + 1 step

 */

/**
 * @param {number} n
 * @return {number}
 */
let climbStairs = function(n) {
    if (n === 0) {
        return 0;
    }
    let result = [0];
    let counter = 0;
    while (result.length > 0) {
        let temp = [];
        result.forEach((item) => {
            let one = item + 1;
            let two = item + 2;
            if (one < n) {
                temp.push(one);
                if (item + 2 < n) {
                    temp.push(two);
                } else if (two === n) {
                    counter++;
                }
            } else if (one === n) {
                counter++;
            }
        });
        result = temp;
    }
    return counter;
};

let climbStairs2 = function(n) {
    if (n < 3) {
        return n;
    }
    let prev1 = 1;
    let prev2 = 2;
    let count = 0;
    for (let i = 3; i <= n; i++) {
        count = prev1 + prev2;
        prev1 = prev2;
        prev2 = count;
    }
    return count;
};

let climbStairs3 = function(n) {
    let sqrt5 = Math.sqrt(5);
    return Math.round(Math.pow((1 + sqrt5) / 2, n + 1) / sqrt5);
};

console.log(climbStairs2(50));
console.log(climbStairs(4), climbStairs2(4));
console.log(climbStairs(5), climbStairs2(5));
console.log(climbStairs(6), climbStairs2(6));
console.log(climbStairs(7), climbStairs2(7));
console.log(climbStairs(8), climbStairs2(8));
console.log(climbStairs(9), climbStairs2(9));
