/**
 * @param {string} s
 * @return {boolean}
 */
let isValid = function(s) {
    let list = [];
    for (let i = 0, l = s.length; i < l; i++) {
        switch (s[i]) {
            case '(':
            case '[':
            case '{':
                list.push(s[i]);
                break;
            case ')':
                if (list[list.length - 1] === '(') {
                    list.pop();
                } else {
                    return false;
                }
                break;
            case ']':
                if (list[list.length - 1] === '[') {
                    list.pop();
                } else {
                    return false;
                }
                break;
            case '}':
                if (list[list.length - 1] === '{') {
                    list.pop();
                } else {
                    return false;
                }
                break;
        }
    }
    return list.length === 0;
};

let isValid2 = function(s) {
    let list = [];
    let solution = ['()', '[]', '{}'];
    for (let i = 0, l = s.length; i < l; i++) {
        switch (s[i]) {
            case '(':
            case '[':
            case '{':
                list.push(s[i]);
                break;
            case ')':
            case ']':
            case '}':
                if (solution.indexOf(list[list.length - 1] + s[i]) !== -1) {
                    list.pop();
                } else {
                    return false;
                }
                break;
        }
    }
    return list.length === 0;
};



console.log(isValid('()'));
console.log(isValid('()[]{}'));
console.log(isValid('{[]}'));
console.log(isValid('(]'));
