/**
 Given an array of integers where 1 ≤ a[i] ≤ n (n = size of array), some elements appear twice and others appear once.

 Find all the elements of [1, n] inclusive that do not appear in this array.

 Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.

 Example:

 Input:
 [4,3,2,7,8,2,3,1]

 Output:
 [5,6]
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let findDisappearedNumbers = function(nums) {
    let result = new Array(nums.length).fill(1);
    nums.forEach((item) => {
        result[item - 1] = 0;
    });
    return result.map((item, index) => item ? index + 1 : 0).filter(Boolean)
};

let findDisappearedNumbers2 = function(nums) {
    nums.forEach((item) => {
        let val = Math.abs(item) - 1;
        if (nums[val] > 0) {
            nums[val] = -nums[val]
        }
    });
    let result = [];
    nums.forEach((item, index) => {
        item > 0 && result.push(index + 1);
    });
    return result;
};
console.log(findDisappearedNumbers([4,3,2,7,8,2,3,1]));
console.log(findDisappearedNumbers2([4,3,2,7,8,2,3,1]));

// TODO
