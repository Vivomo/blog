// Q1 数组最大和区间
const dataOfQ1 = [15, -123, 32, -55, 232, 32, -14, -122, 342, 54, -78, 11, -49];
// const dataOfQ1 = [3,-2,-3,-3,1,3,0];

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

console.log(findMaxSumOfArr(dataOfQ1));