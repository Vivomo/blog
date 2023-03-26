// 数组寻找一个区间和等于某数字
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