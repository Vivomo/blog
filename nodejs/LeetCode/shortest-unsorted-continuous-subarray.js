/**
 Given an integer array, you need to find one continuous subarray that if you only sort this subarray in ascending order, then the whole array will be sorted in ascending order, too.

 You need to find the shortest such subarray and output its length.

 Example 1:
 Input: [2, 6, 4, 8, 10, 9, 15]
 Output: 5
 Explanation: You need to sort [6, 4, 8, 10, 9] in ascending order to make the whole array sorted in ascending order.
 Note:
 Then length of the input array is in range [1, 10,000].
 The input array may contain duplicates, so ascending order here means <=.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
let findUnsortedSubarray = function(nums) {
    let start = 0;
    let end = nums.length - 1;
    let sorted = true;
    for (let i = 0, lastIndex = nums.length - 1; i < lastIndex; i++) {
        if (nums[i] > nums[i + 1]) {
            start = i;
            sorted = false;
            break;
        }
    }
    if (sorted) {
        return 0;
    }

    for (let i = nums.length - 1; i > 0; i--) {
        if (nums[i] < nums[i - 1]) {
            end = i;
            break;
        }
    }
    let min = nums[start];
    let max = nums[start];
    for (let i = start + 1; i <= end; i++) {
        if (nums[i] < min) {
            min = nums[i];
        }
        if (nums[i] > max) {
            max = nums[i];
        }
    }
    while (min < nums[start - 1]) {
        start--;
    }
    while (max > nums[end + 1]) {
        end++;
    }
    return end - start + 1;
};


console.log(findUnsortedSubarray( [1,3,5,2,4])); // 4
console.log(findUnsortedSubarray( [1,2,4,5,3])); // 3
console.log(findUnsortedSubarray( [2, 6, 4, 8, 10, 9, 15])); // 5
console.log(findUnsortedSubarray( [1,3,2,2,2])); // 4
