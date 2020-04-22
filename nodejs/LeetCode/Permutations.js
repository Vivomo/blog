/**
 Given a collection of distinct integers, return all possible permutations.

 Example:

 Input: [1,2,3]
 Output:
 [
 [1,2,3],
 [1,3,2],
 [2,1,3],
 [2,3,1],
 [3,1,2],
 [3,2,1]
 ]
 */


function findPermutations(res, cur, nums) {
    if(cur.length === nums.length) {
        res.push(cur.slice());
        return;
    }

    for(let num of nums) {
        if(!cur.includes(num)) {
            cur.push(num);
            findPermutations(res, cur, nums);
            cur.pop(num);
        }
    }
}
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let permute = function(nums) {
    if(!nums.length) return [];

    let res = [];
    findPermutations(res, [], nums);
    return res;
};


console.log(permute([1, 2, 3]));