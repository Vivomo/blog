/**
 Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value.

 Your algorithm's runtime complexity must be in the order of O(log n).

 If the target is not found in the array, return [-1, -1].

 Example 1:

 Input: nums = [5,7,7,8,8,10], target = 8
 Output: [3,4]
 Example 2:

 Input: nums = [5,7,7,8,8,10], target = 6
 Output: [-1,-1]

 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
let searchRange = function(nums, target) {
    let index = -1;
    let start = 0;
    let end = nums.length - 1;
    while (start <= end) {
        let mid = ~~((end + start) / 2);
        let num = nums[mid];
        if (num === target) {
            index = mid;
            break;
        } else if (num < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    let result = [index, index];
    if (index === -1) {
        return result;
    }
    while (nums[result[0] - 1] === target) {
        result[0]--
    }
    while (nums[result[1] + 1] === target) {
        result[1]++
    }
    return result;
};
