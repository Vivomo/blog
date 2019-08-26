/**
 *
 * Given a list of daily temperatures T, return a list such that, for each day in the input, tells you how many days you would have to wait until a warmer temperature.
 * If there is no future day for which this is possible, put 0 instead.

 For example, given the list of temperatures T = [73, 74, 75, 71, 69, 72, 76, 73], your output should be [1, 1, 4, 2, 1, 1, 0, 0].

 Note: The length of temperatures will be in the range [1, 30000]. Each temperature will be an integer in the range [30, 100].
 * */
/**
 * @param {number[]} T
 * @return {number[]}
 */
let dailyTemperatures = function(T) {
    let l = T.length;
    return T.map((item, index) => {
        for (let i = index + 1; i < l; i++) {
            if (T[i] > item) {
                return i - index;
            }
        }
        return 0;
    });
};


/**
 * @param {number[]} T
 * @return {number[]}
 */
let dailyTemperatures2 = function(T) {
    let ans = new Array(T.length).fill(0);
    let next = new Array(101);
    let MAX = Math.pow(2, 31);
    next.fill(next, MAX);
    for (let i = T.length - 1; i >= 0; --i) {
        let warmer_index = MAX;
        for (let t = T[i] + 1; t <= 100; ++t) {
            if (next[t] < warmer_index)
                warmer_index = next[t];
        }
        if (warmer_index < MAX)
            ans[i] = warmer_index - i;
        next[T[i]] = i;
    }
    return ans;
};

let dailyTemperatures3 = function(T) {
    let ans = new Array(T.length);
    let stack = [];
    for (let i = T.length - 1; i >= 0; --i) {
        while (stack.length !== 0 && T[i] >= T[stack[stack.length - 1]]) stack.pop();
        ans[i] = stack.length === 0 ? 0 : stack[stack.length - 1] - i;
        stack.push(i);
    }
    return ans;
};


console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
console.log(dailyTemperatures2([73, 74, 75, 71, 69, 72, 76, 73]));
console.log(dailyTemperatures3([73, 74, 75, 71, 69, 72, 76, 73]));
