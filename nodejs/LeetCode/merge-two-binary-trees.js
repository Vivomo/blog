/**
 Given two binary trees and imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not.

 You need to merge them into a new binary tree. The merge rule is that if two nodes overlap, then sum node values up as the new value of the merged node. Otherwise, the NOT null node will be used as the node of new tree.

 Example 1:

 Input:
 Tree 1                     Tree 2
 1                         2
 / \                       / \
 3   2                     1   3
 /                           \   \
 5                             4   7
 Output:
 Merged tree:
 3
 / \
 4   5
 / \   \
 5   4   7


 Note: The merging process must start from the root nodes of both trees.
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} t1
 * @param {TreeNode} t2
 * @return {TreeNode}
 */
let mergeTrees = function(t1, t2) {

    function addNode(n1, n2) {
        n1.val += n2.val;
        if (n1.left === null) {
            n1.left = n2.left;
        } else if (n2.left !== null) {
            addNode(n1.left, n2.left);
        }

        if (n1.right === null) {
            n1.right = n2.right;
        } else if (n2.right !== null) {
            addNode(n1.right, n2.right);
        }
    }

    if (t1 === null) {
        return t2;
    }
    if (t2 === null) {
        return t1;
    }

    addNode(t1, t2);

    return t1;
};

/**
 * https://leetcode.com/problems/merge-two-binary-trees/discuss/363301/99.4-Javascript-solution-ez
 * @author by leetcode vortexer103
 * @param t1
 * @param t2
 * @returns {*}
 */
let mergeTrees2 = function(t1, t2) {
    if (t1 == null) {
        return t2
    }
    if (t2) {
        t1.val += t2.val
        t1.left = mergeTrees(t1.left, t2.left)
        t1.right = mergeTrees(t1.right, t2.right)
    }
    return t1
}

function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

let tn1 = new TreeNode(1);
tn1.left = new TreeNode(3);
tn1.left.left = new TreeNode(5);

tn1.right = new TreeNode(2);

let tn2 = new TreeNode(2);
tn2.left = new TreeNode(1);
tn2.right = new TreeNode(3);

tn2.left.right = new TreeNode(4);
tn2.right.right = new TreeNode(7);

console.log(mergeTrees(tn1, tn2));
