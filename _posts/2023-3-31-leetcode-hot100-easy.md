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

### 两数之和
```js
/**
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
 你可以按任意顺序返回答案。
 示例 1：
 输入：nums = [2,7,11,15], target = 9
 输出：[0,1]
 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
 示例 2：
 输入：nums = [3,2,4], target = 6
 输出：[1,2]
 示例 3：
 输入：nums = [3,3], target = 6
 输出：[0,1]
 */
const twoSum = (nums, target) => {
  const map = {};               
  for (let i = 0; i < nums.length; i++) {   
    const targetNum = target - nums[i];   
    const targetNumIndex = map[targetNum];
    if (targetNumIndex === undefined) {
      map[nums[i]] = i;
    } else {
      return [targetNumIndex, i];
    }
  }
}
```

### 两数相加
```js
/**
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 请你将两个数相加，并以相同形式返回一个表示和的链表。
 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
 输出：[8,9,9,9,0,0,0,1]
 */
const addTwoNumbers = function(l1, l2) {
  let head = null, tail = null;
  let carry = 0;
  while (l1 || l2) {
    const n1 = l1 ? l1.val : 0;
    const n2 = l2 ? l2.val : 0;
    const sum = n1 + n2 + carry;
    if (!head) {
      head = tail = new ListNode(sum % 10);
    } else {
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }
    carry = sum < 10 ? 0 : 1;
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  if (carry > 0) {
    tail.next = new ListNode(carry);
  }
  return head;
};
```
### 有效的括号
```js
/**
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
 有效字符串需满足：
 左括号必须用相同类型的右括号闭合。
 左括号必须以正确的顺序闭合。
 每个右括号都有一个对应的相同类型的左括号。
 示例 1：
 输入：s = "()"
 输出：true
 示例 2：
 输入：s = "()[]{}"
 输出：true
 示例 3：
 输入：s = "(]"
 输出：false
 */
const isValid = function(s) {
  if (s.length % 2 === 1) {
    return false;
  }
  
  let map = {
    '(': 1,
    '[': 3,
    '{': 5,
    ')': 10,
    ']': 30,
    '}': 50
  };
  let arr = [];
  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    let n = map[c]; 
    if (n < 10) {
      arr.push(n)
    } else {
      if (n / arr[arr.length - 1] === 10) {
        arr.pop();
      } else {
        return false;
      }
    }
    if (arr.length > s.length - i) {
      return false;
    }
  }
  return arr.length === 0;
};
```