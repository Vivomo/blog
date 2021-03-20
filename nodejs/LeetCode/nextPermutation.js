/**
 Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.

 If such arrangement is not possible, it must rearrange it as the lowest possible order (ie, sorted in ascending order).

 The replacement must be in-place and use only constant extra memory.

 Here are some examples. Inputs are in the left-hand column and its corresponding outputs are in the right-hand column.

 1,2,3 → 1,3,2
 3,2,1 → 1,2,3
 1,1,5 → 1,5,1

 */
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
let nextPermutation = function(nums) {
    let update = false;
    for (let i = nums.length - 1; i > 0; i--) {
        if (nums[i] > nums[i - 1]) {
            let temp = nums[i];
            nums[i] = nums[i - 1];
            nums[i - 1] = temp;
            update = true;
            break;
        }
    }
    if (!update) {
        for (let i = 0, mid = ~~(nums.length / 2); i <= mid; i++) {
            let temp = nums[i];
            nums[i] = nums[nums.length - 1 - i];
            nums[nums.length - 1 - i] = temp;
        }
    }
};
let num = [10, 10, 10, 10, 10];
nextPermutation(num);
console.log(num);

let swap = (arr, from, to) => {
    let tmp = arr[from];
    arr[from] = arr[to];
    arr[to] = tmp;
};

let nextPermutation2 = (nums) => {
    let len = nums.length;
    let i = len - 2;
    let j = len - 1;

    while (i >= 0 && nums[i] >= nums[i + 1]) i--;

    if (i >= 0) {
        while (j > i && nums[j] <= nums[i]) j--;
        swap(nums, i, j);
        reverse(nums, i + 1, len - 1);
    } else {
        reverse(nums, 0, len - 1);
    }
};


let reverse = (arr, start, end) => {
    while (start < end) {
        swap(arr, start, end);
        start++;
        end--;
    }
};


