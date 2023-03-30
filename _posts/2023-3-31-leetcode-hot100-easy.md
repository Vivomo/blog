---
layout: blog
title: LeetCode hot 100简单篇（更新中……）
tags: algorithm
---


### 合并二叉树
```js
/**
 *  * Definition for a binary tree node.
 *  * function TreeNode(val, left, right) {
 *  *     this.val = (val===undefined ? 0 : val)
 *  *     this.left = (left===undefined ? null : left)
 *  *     this.right = (right===undefined ? null : right)
 *  * }
 *  *
 * 给你两棵二叉树： root1 和 root2 。
 * 想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。
 * 返回合并后的二叉树。
 * 注意: 合并过程必须从两个树的根节点开始
 *
 * 输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
 * 输出：[3,4,5,5,4,null,7]
 */

const mergeTrees = function(root1, root2) {
  if (root1 === null) return root2;
  if (root2 === null) return root1;

  let queue = [];
  queue.push(root1);
  queue.push(root2);
  while (queue.length) {
    let node1 = queue.shift();
    let node2 = queue.shift();;
    node1.val += node2.val;
    if (node1.left !== null && node2.left !== null) {
      queue.push(node1.left);
      queue.push(node2.left);
    }
    if (node1.right !== null && node2.right !== null) {
      queue.push(node1.right);
      queue.push(node2.right);
    }
    if (node1.left === null && node2.left !== null) {
      node1.left = node2.left;
    }
    if (node1.right === null && node2.right !== null) {
      node1.right = node2.right;
    }
  }
  return root1;
};

```

### 爬楼梯(菲波那切数列)
```js
/**
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 */
const climbStairs = function(n) {
  if (n <= 2) {
    return n;
  }
  let l1 = 1;
  let l2 = 2;
  let result = 0;
  for (let i = 3; i <= n; i ++) {
    result = l1 + l2;
    l1 = l2;
    l2 = result;
  }
  return result;
};
```