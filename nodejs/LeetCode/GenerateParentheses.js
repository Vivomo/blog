/**
 * @param {number} n
 * @return {string[]}
 */
let generateParenthesis = function(n) {
    if (n === 0) {
        return [];
    }
    let result = new Set();
    let temp = '';
    for (let i = 0; i < n; i++) {
        temp += '('
    }
    result.add(temp);
    let isValid = (str) => {
        let state = 1;
        for (let i = 1; i < str.length; i++) {
            state += str[i] === '(' ? 1 : -1;
            if (state < 0) {
                return false
            }
        }
        return true;
    };
    for (let i = 0; i < n; i++) {
        let newList = new Set();
        result.forEach((str) => {
            for (let s = 1; s <= str.length; s++) {
                if (str[s - 1] === ')') {
                    continue;
                }
                let _str = str.substring(0, s) + ')' + str.substr(s);
                if (isValid(_str)) {
                    !newList.has(_str) && newList.add(_str);
                }
            }
        });
        result = newList;
    }
    return [...result];
};

var generateParenthesis2 = function(n) {
    let res = [], temRes = '', left = 0, right = 0;
    helper(temRes, left, right, n, res);
    return res
};

function helper(temRes, left, right, level, res) {
    if (left > level || right > left)
        return;
    if (left === right && level * 2 === temRes.length) {
        res.push( temRes );
        return;
    }

    helper(temRes + '(', left + 1, right, level, res)
    helper(temRes + ')', left, right + 1, level, res)
}

console.log(generateParenthesis2(1));
console.log(generateParenthesis2(2));
console.log(generateParenthesis2(3));


