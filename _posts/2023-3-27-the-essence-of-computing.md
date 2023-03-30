---
layout: blog
title: 计算之魂1-4章思考题（更新中……）
tags: algorithm
---

## 数组最大和区间
这个问题在LeetCode中也有
```js
const dataOfQ1 = [15, -123, 32, -55, 232, 32, -14, -122, 342, 54, -78, 11, -49];

const findMaxSumOfArr = (nums) => {
  let ans = nums[0];
  let sum = 0;
  for(const num of nums) {
    if(sum > 0) {
      sum += num;
    } else {
      sum = num;
    }
    ans = Math.max(ans, sum);
  }
  return ans;
}

```

## 数组寻找一个区间和等于某数字

```js
// 解析参考 https://zhuanlan.zhihu.com/p/476641538
const findRangeSumEqualsTarget = (arr, target) => {
  const map = new Map();
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (sum === target) {
      return [0, i];
    }
    if (map.has(sum - target)) {
      return [map.get(sum - target) + 1, i];
    }
    if (!map.has(sum)) {
      map.set(sum, i);
    }
  }
  return [-1, -1];
}

const data = [2, -3, 5, -7, 11, 13, 17, -19];

console.log(findRangeSumEqualsTarget(data, 24));
```

## 寻找最大的二维矩阵
```js

```