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
    let begin = 0;
    let end = lastIndex;
    while (arr[begin] < 0 && begin <= lastIndex) {
        begin++;
    }
    if (begin > lastIndex) {
        return 0;
    }
    while (arr[end] < 0 && end >= begin) {
        end--;
    }

    let endIndex = begin;
    let tempBegin = begin;
    let maxSum = 0;
    for(let i = begin; i <= end; i++) {
        sum += arr[i];
        if (sum > maxSum) {
            endIndex = i;
            begin = tempBegin;
            maxSum = sum;
        } else {
            if (sum < 0) {
                do {
                    i++
                } while (arr[i] <= 0 && i <= end)
                if (i <= end) {
                    tempBegin = i;
                    i--;
                    sum = 0;
                }
            }
        }
    }
    return maxSum;
}

maxSubArray([-2,1,-3,4,-1,2,1,-5,4])