/**
 * Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

 (i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).

 You are given a target value to search. If found in the array return its index, otherwise return -1.

 You may assume no duplicate exists in the array.

 Your algorithm's runtime complexity must be in the order of O(log n).

 Example 1:

 Input: nums = [4,5,6,7,0,1,2], target = 0
 Output: 4
 Example 2:

 Input: nums = [4,5,6,7,0,1,2], target = 3
 Output: -1
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
let search = function(nums, target) {
    let startIndex = 0;
    let endIndex = nums.length - 1;
    while (endIndex >= startIndex) {
        let midIndex = ~~((startIndex + endIndex) / 2);
        let mid = nums[midIndex];
        let start = nums[startIndex];
        let end = nums[endIndex];
        if (target < mid) {
            if (mid < start) {
                endIndex = midIndex - 1;
            } else {
                if (target > start) {
                    endIndex = midIndex - 1;
                } else if (target < start) {
                    startIndex = midIndex + 1;
                } else {
                    return startIndex;
                }
            }
        } else if (target > mid) {
            if (mid > end) {
                startIndex = midIndex + 1;
            } else {
                if (target > end) {
                    endIndex = midIndex - 1;
                } else if (target < end) {
                    startIndex = midIndex + 1;
                } else {
                    return endIndex;
                }
            }
        } else {
            return midIndex;
        }
    }
    return -1;
};

console.log(search([4,5,6,7,8,1,2,3], 8));
console.log(search([4,5,6,7,0,1,2], 3));
console.log(search([4,5,6,7,0,1,2], 2));
console.log(search([5,1,3], 3));
console.log(search([3, 1], 1));
console.log(search([1, 3], 1));
