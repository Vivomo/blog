/**
 * Given a string, find the length of the longest substring without repeating characters.

 Examples:

 Given "abcabcbb", the answer is "abc", which the length is 3.

 Given "bbbbb", the answer is "b", with the length of 1.

 Given "pwwkew", the answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.


 *
 *
 * @param s
 * @returns {Number}
 */
const lengthOfLongestSubstring = function(s) {
    let maxSub = '';
    for (let i = 0; i < s.length; i++) {
        let _maxSub = s[i];
        for (let j = i + 1; j < s.length; j++) {
            let c = s[j];
            if (_maxSub.includes(c)) {
                break;
            }
            _maxSub = s.substring(i, j + 1);
        }
        if (_maxSub.length > maxSub.length) {
            maxSub = _maxSub
        }
        if (maxSub.length >= s.length - i - 1) {
            break;
        }
    }
    return maxSub.length;
};


lengthOfLongestSubstring('abcabcbb');
