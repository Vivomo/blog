/**
 * Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

 Example:

 Input: [-2,1,-3,4,-1,2,1,-5,4],
 Output: 6
 Explanation: [4,-1,2,1] has the largest sum = 6.
 *
 */

function maxSubArray(arr) {
    let lastIndex = arr.length - 1;
    let sum = 0;
    let maxSum = arr[0];
    if (maxSum < 0) {
        for (let i = 1; i <= lastIndex; i++) {
            if (arr[i] > maxSum) {
                maxSum = arr[i]
            }
            if (maxSum > 0) {
                break;
            }
        }
    }
    for(let i = 0; i <= lastIndex; i++) {
        sum += arr[i];
        if (sum > maxSum) {
            maxSum = sum;
        } else {
            if (sum < 0) {
                do {
                    i++
                } while (arr[i] <= 0 && i <= lastIndex);
                if (i <= lastIndex) {
                    i--;
                    sum = 0;
                }
            }
        }
    }
    return maxSum;
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))
console.log(maxSubArray([-2, -3, 2]))
console.log(maxSubArray([-2, -3]))
console.log(maxSubArray([-4, -3]))