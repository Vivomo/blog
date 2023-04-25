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
    '(': ')',
    '[': ']',
    '{': '}',
  };
  let arr = [];
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (map[char]) {
      arr.push(char)
    } else {
      if (map[arr[arr.length - 1]] === char) {
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
### 只出现一次的数字
```js
/**
 * 给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
 */
const singleNumber = (nums) => {
  return nums.reduce((prev, cur) => {
    return prev ^ cur;  
  }, 0);
};
```
### 比特位计数
```js
/**
 * 给你一个整数 n ，对于 0 <= i <= n 中的每个 i ，计算其二进制表示中 1 的个数 ，返回一个长度为 n + 1 的数组 ans 作为答案。
 * 输入：n = 5
 输出：[0,1,1,2,1,2]
 解释：
 0 --> 0
 1 --> 1
 2 --> 10
 3 --> 11
 4 --> 100
 5 --> 101
 */
const countBits = (n) => {
  const bits = new Array(n + 1).fill(0);
  let highBit = 0;
  for (let i = 1; i <= n; i++) {
    if ((i & (i - 1)) == 0) {
      highBit = i;
    }
    bits[i] = bits[i - highBit] + 1;
  }
  return bits;
};
```
### 移动零
```js
/**
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 请注意 ，必须在不复制数组的情况下原地对数组进行操作。
 示例 1:
 输入: nums = [0,1,0,3,12]
 输出: [1,3,12,0,0]
 */
const moveZeroes = (nums) => {
  for (let i = 0, l = nums.length; i < l; i++) {
    if (nums[i] === 0) {
      nums.splice(i, 1);
      nums.push(0);
      i -= 1;
      l -= 1;
    }
  }
};
```
### 找到所有数组中消失的数字
```js
/**
 * 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。
 输入：nums = [4,3,2,7,8,2,3,1]
 输出：[5,6]
 */
var findDisappearedNumbers = function(nums) {
  const n = nums.length;
  for (const num of nums) {
    const x = (num - 1) % n;
    nums[x] += n;
  }
  const ret = [];
  for (const [i, num] of nums.entries()) {
    if (num <= n) {
      ret.push(i + 1);
    }
  }
  return ret;
};
```
### 汉明距离
```js
/**
 * 两个整数之间的 汉明距离 指的是这两个数字对应二进制位不同的位置的数目。
 给你两个整数 x 和 y，计算并返回它们之间的汉明距离。
 */
const hammingDistance = (x, y) => {
  let s = x ^ y, res = 0;
  while (s != 0) {
    s &= s - 1;
    res++;
  }
  return res;
};
```
### 合并两个有序链表
```js
/**
 * 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的
 */
const mergeTwoLists = (list1, list2) => {
  const result = new ListNode(-1);
  let prev = result;
  while (list1 != null && list2 != null) {
    if (list1.val <= list2.val) {
      prev.next = list1;
      list1 = list1.next;
    } else {
      prev.next = list2;
      list2 = list2.next;
    }
    prev = prev.next;
  }
  prev.next = list1 === null ? list2 : list1;
  return result.next;
};
```
### 买卖股票的最佳时机
```js
/**
 * 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
 */
const maxProfit = (prices) => {
  let minprice = Number.MAX_SAFE_INTEGER;
  let maxprofit = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minprice) {
      minprice = prices[i];
    } else if (prices[i] - minprice > maxprofit) {
      maxprofit = prices[i] - minprice;
    }
  }
  return maxprofit;
};
```
### 多数元素
```js
/**
 * 给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
 */
const majorityElement = (nums) => {
  let count = 0;
  let candidate = null;
  for (let num of nums) {
    if (count == 0) {
      candidate = num;
    }
    count += (num == candidate) ? 1 : -1;
  }
  return candidate;
};
```
### 环形链表
```js
/**
 * 给你一个链表的头节点 head ，判断链表中是否有环。
 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
 如果链表中存在环 ，则返回 true 。 否则，返回 false 。
 */
const hasCycle = (head) => {
  if (head == null || head.next == null) {
    return false;
  }
  let slow = head;
  let fast = head.next;
  while (slow != fast) {
    if (fast == null || fast.next == null) {
      return false;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
};
```
### 相交链表
```js
/**
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null
 * 题目数据 保证 整个链式结构中不存在环。
 注意，函数返回结果后，链表必须 保持其原始结构 。
 */
const getIntersectionNode = (headA, headB) => {
  if (headA === null || headB === null) {
    return null;
  }
  let pA = headA, pB = headB;
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }
  return pA;
};
```
### 反转链表
```js
/**
 * 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */
const reverseList = (head) => {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};
```
### 回文链表
```js
/**
 * 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
 */
const isPalindrome = (head) => {
  const vals = [];
  while (head !== null) {
    vals.push(head.val);
    head = head.next;
  }
  for (let i = 0, j = vals.length - 1; i < j; ++i, --j) {
    if (vals[i] !== vals[j]) {
      return false;
    }
  }
  return true;
};
```