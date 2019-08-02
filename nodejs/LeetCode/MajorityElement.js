/**
 Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊ n/2 ⌋ times.

 You may assume that the array is non-empty and the majority element always exist in the array.

 */

 /**
 * @param {number[]} nums
 * @return {number}
 */
let majorityElement = function(nums) {
    let counter = {};
    let max = null;
    let l = nums.length;
    nums.some((item) => {
        if(counter[item]) {
            counter[item]++;
            if (counter[item] > l / 2) {
                max = item;
                return true;
            }
        } else {
            counter[item] = 1;
        }
    });
    if (max !== null) {
        return max;
    }
    Object.values(counter).some((value) => {
        if (value > l / 2) {
            max = value
            return true;
        }
    });
    for(let k in counter) {
        if (counter[k] > l / 2) {
            return k;
        }
    }
};
console.log(majorityElement([2, 2, 1, 2]));
console.log(majorityElement([2, 2, 1, 2, 1, 1, 1]));
console.log(majorityElement([1]));
console.log(majorityElement([2]));
