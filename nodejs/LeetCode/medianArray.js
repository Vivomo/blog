/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
let findMedianSortedArrays = function(nums1, nums2) {
    let i = 0;
    let j = 0;
    let m = nums1.length;
    let n = nums2.length;
    let l = m + n;
    let middle = l / 2;
    while (i + j <= middle) {
        if (i === n) {
            j++;
            continue;
        } else if (j === n) {
            i++;
            continue;
        }
        if (nums1[i] > nums2[j]) {
            j++
        } else {
            i++;
        }

    }
};