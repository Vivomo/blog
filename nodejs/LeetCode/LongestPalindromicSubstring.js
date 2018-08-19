// 5. Longest Palindromic Substring
/**
 Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

 Example 1:

 Input: "babad"
 Output: "bab"
 Note: "aba" is also a valid answer.
 Example 2:

 Input: "cbbd"
 Output: "bb"

 */

let longestPalindrome = (s) => {
    let start = 0;
    let len = 1;

    for (let i = 0; i < s.length - 1; i++) {
        if (s[i - 1] === s[i + 1]) {
            let _len = 1;
            for (let j = 1; i - j >= 0 && i + j <= s.length - 1; j++) {
                if (s[i - j] === s[i + j]) {
                    _len += 2;
                } else {
                    break;
                }
            }
            if (_len > len) {
                len = _len;
                start = i + 1 - Math.ceil(len / 2);
            }
        }

        if (s[i] === s[i + 1]){
            let _len = 2;
            for (let j = 1; i - j >= 0 && i + j < s.length - 1; j++) {
                if (s[i - j] === s[i + j + 1]) {
                    _len += 2;
                } else {
                    break;
                }
            }
            if (_len > len) {
                len = _len;
                start = i + 1 - len / 2;
            }
        }
        if (len / 2 >= s.length - i - 1) {
            break;
        }
    }

    return s.substr(start, len);
};

console.log(longestPalindrome('ccc'));
console.log(longestPalindrome('cccc'));
console.log(longestPalindrome('abcded'));
console.log(longestPalindrome('baba'));
console.log(longestPalindrome('abbc'));