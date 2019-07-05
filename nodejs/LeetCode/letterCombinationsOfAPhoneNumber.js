/**
 * @param {string} digits
 * @return {string[]}
 */
let data = [
    null,
    null,
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j', 'k', 'l'],
    ['m', 'n', 'o'],
    ['p', 'q', 'r', 's'],
    ['t', 'u', 'v'],
    ['w', 'x', 'y', 'z']
];
let letterCombinations = function(digits) {
    let result = [];
    if (!digits) {
        return result;
    }
    result.push('');
    for (let i = 0; i < digits.length; i++) {
        let temp = [];
        data[digits[i]].forEach((item) => {
            result.forEach((resultItem) => {
                temp.push(resultItem + item);
            });
        });
        result = temp;
    }
    return result;
};

console.log(letterCombinations('234'));
