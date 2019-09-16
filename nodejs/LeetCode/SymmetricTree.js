/**
 Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).

 For example, this binary tree [1,2,2,3,4,4,3] is symmetric:

    1
   / \
  2   2
 / \  / \
3  4 4  3


 But the following [1,2,2,null,3,null,3] is not:

 1
 / \
 2   2
 \   \
 3    3

 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */

let isSymmetric = function(root) {
    let arr = [root.left, root.right];
    while (true) {
        let temp = [];
        for (let i = 0, l = arr.length - 1; i < l / 2; i += 2) {
            if (arr[i].val !== arr[i + 1].val) {
                return false
            }
        }

    }
};


function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

// TODO
