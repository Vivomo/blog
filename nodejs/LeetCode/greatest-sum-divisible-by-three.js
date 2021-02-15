let maxSum = (nums) => {
    let sum = 0;
    let arr1 = [];
    let arr2 = [];
    let fn = (arr, item) => {
        if (arr.length === 0) {
            arr.push(item);
        } else if (arr.length === 1) {
            if (arr[0] > item) {
                arr.unshift(item);
            } else {
                arr.push(item);
            }
        } else {
            if (arr[0] > item) {
                arr[1] = arr[0];
                arr[0] = item;
            } else if (arr[1] > item) {
                arr[1] = item;
            }
        }
    }
    for (let item of nums) {
        sum += item;
        let mod = item % 3;
        if (mod === 1) {
            fn(arr1, item);
        } else if (mod === 2) {
            fn(arr2, item);
        }
    }
    let mod = sum % 3;
    if (mod === 0) {
        return sum;
    }

    let [a10 = 0, a11 = 0] = arr1;
    let [a20 = 0, a21 = 0] = arr2;
    let sum1 = a10 + a11;
    let sum2 = a20 + a21;
    if (arr2.length + arr1.length === 1) {
        sum -= sum1 + sum2;
        return sum;
    }
    let index = mod - 1;
    if (arr1.length === 2) {
        if (arr2.length === 0) {
            sum -= [a10, sum1][index];
        } else if (arr2.length === 1) {
            sum -= [a10, Math.min(a20, sum1)][index];
        } else {
            sum -= [Math.min(a10, sum2), Math.min(a20, sum1)][index];
        }
    } else if (arr2.length === 2) {
        if (arr1.length === 0) {
            sum -= [sum2, a20][index];
        } else if (arr1.length === 1) {
            sum -= [Math.min(a10, sum2), a20][index];
        } else {
            sum -= [Math.min(a10, sum2), Math.min(a20, sum1)][index];
        }
    }
    return sum;
}

let test = (nums) => {
    return maxSum(nums) === maxSumDivThree(nums);
}

let maxSumDivThree = (nums) => {
    let dp = [0, 0, 0];
    for (let i = 0; i < nums.length; i++) {
        let mod = nums[i] % 3;
        let a = dp[(3 - mod) % 3];
        let b = dp[(4 - mod) % 3];
        let c = dp[(5 - mod) % 3];
        if (a || mod === 0) dp[0] = Math.max(dp[0], a + nums[i]);
        if (b || mod === 1) dp[1] = Math.max(dp[1], b + nums[i]);
        if (c || mod === 2) dp[2] = Math.max(dp[2], c + nums[i]);
    }
    return dp[0];
}



console.log(test([2,19,6,16,5,10,7,4,11,6]))

console.log(test([2,6,2,2,7]))
console.log(test([4]))
console.log(test([3,6,5,1,8]))
console.log(test([1,2,3,4,4]))