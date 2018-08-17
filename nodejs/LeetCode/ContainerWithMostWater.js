/**
 * Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

 Note: You may not slant the container and n is at least 2.

 The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

 Example:

 Input: [1,8,6,2,5,4,8,3,7]
 Output: 49
 * @param {number[]} arr
 * @return {number}
 */
let maxArea = function(arr) {
    if (arr.length < 2) {
        return 0
    }
    let start = 0;
    let end = arr.length - 1;
    let maxArea = getArea(arr, start, end);
    do {
        if (arr[start] > arr[end]) {
            let find = false;
            let _end = end;
            for (let i = end - 1; i > start; i--) {
                if (arr[i] > arr[end]) {
                    if (_end === end) {
                        _end  = i;
                    }
                    let _area = getArea(arr, start, i);
                    if (_area > maxArea) {
                        maxArea = _area;
                        end = i;
                        find = true;
                        break;
                    }
                }
            }
            if (!find) {
                if (end === _end) {
                    break;
                } else {
                    end = _end;
                }
            }
        } else {
            let find = false;
            let _start = start;
            for (let i = start + 1; i < end; i++) {
                if (arr[i] > arr[start]) {
                    if (start === _start) {
                        _start = i;
                    }
                    let _area = getArea(arr, i, end);
                    if (_area > maxArea) {
                        maxArea = _area;
                        start = i;
                        find = true;
                        break;
                    }
                }
            }
            if (!find) {
                if (start === _start) {
                    break;
                } else {
                    start = _start;
                }
            }
        }

    } while (end - start > 1);
    return maxArea;
};

function getArea(arr, start, end) {
    return Math.min(arr[start], arr[end]) * (end - start);
}



// better solution

let maxArea2 = (arr) => {
    let end = arr.length - 1;
    let start = 0;
    let max = 0;
    while (start < end) {
        max = Math.max(max, Math.min(arr[start], arr[end]) * (end - start));
        if (arr[start] > arr[end]) {
            end--;
        } else {
            start++;
        }
    }
    return max;
};
console.time('a2');
for (let i = 0; i < 1000000; i++) {
    maxArea2([1,8,6,2,5,4,8,3,7]);
    maxArea2([4,5,18,17,6]);
}
console.timeEnd('a2');

console.time('a');
for (let i = 0; i < 1000000; i++) {
    maxArea([1,8,6,2,5,4,8,3,7]);
    maxArea([4,5,18,17,6]);
}
console.timeEnd('a');

