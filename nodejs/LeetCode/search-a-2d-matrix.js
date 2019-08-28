/**
 Write an efficient algorithm that searches for a value in an m x n matrix. This matrix has the following properties:

 Integers in each row are sorted from left to right.
 The first integer of each row is greater than the last integer of the previous row.

 Example 1:

 Input:
 matrix = [
 [1,   3,  5,  7],
 [10, 11, 16, 20],
 [23, 30, 34, 50]
 ]
 target = 3
 Output: true
 Example 2:

 Input:
 matrix = [
 [1,   3,  5,  7],
 [10, 11, 16, 20],
 [23, 30, 34, 50]
 ]
 target = 13
 Output: false
 */
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
let searchMatrix = function(matrix, target) {

    let includesByHalfSearch = (arr, _target) => {
        let start = 0;
        let end = arr.length - 1;
        while (start <= end) {
            let half = ~~((start + end) / 2);
            let value = arr[half];
            if (value < _target) {
                start = half + 1;
            } else if (value > _target) {
                end = half - 1;
            } else {
                return true;
            }
        }
        return false;
    };

    let mLen = matrix.length;
    let startRowIndex = 0;
    let endRowIndex = mLen - 1;
    let targetRowIndex;
    while (endRowIndex >= startRowIndex) {
        targetRowIndex = ~~((endRowIndex + startRowIndex) / 2);
        let targetRow = matrix[targetRowIndex];
        let lessThan = targetRow[0] <= target;
        if (lessThan && (targetRowIndex === mLen - 1 || matrix[targetRowIndex + 1][0] > target)) {
            return includesByHalfSearch(targetRow, target);
        } else {
            if (lessThan) {
                startRowIndex = targetRowIndex + 1;
            } else {
                endRowIndex = targetRowIndex - 1;
            }
        }
    }
    return false;
};

let matrix1 = [
    [1,   3,  5,  7],
    [10, 11, 16, 20],
    [23, 30, 34, 50]
];

console.log(searchMatrix(matrix1, 5));
console.log(searchMatrix(matrix1, 13));
console.log(searchMatrix([], 13));
