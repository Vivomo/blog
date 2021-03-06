let nums = [31, -41, 59, 26, -53, 58, 97, -93, -23, 84];

let n3 = (arr) => {
    let max = 0;
    let l = arr.length;
    for (let i = 0; i < l; i++) {
        for (let j = i; j < l; j++) {
            let sum = 0;
            for (let k = i; k < j; k++) {
                sum += arr[k]
            }
            max = Math.max(max, sum)
        }
    }
    return max;
};

let n2_1 = (arr) => {
    let max = 0;
    let l = arr.length;
    for (let i = 0; i < l; i++) {
        let sum = 0;
        for (let j = i; j < l; j++) {
            sum += arr[j]
            max = Math.max(max, sum)
        }
    }
    return max;
};

let n2_2 = (arr) => {
    let l = arr.length;
    let cumArr = [arr[0]];
    for (let i = 1; i < l; i++) {
        cumArr[i] = cumArr[i - 1] + arr[i]
    }
    let max = 0;
    for (let i = 0; i < l; i++) {
        for (let j = i; j < l; j++) {
            let sum = cumArr[j] - (cumArr[i - 1] || 0);
            max = Math.max(max, sum)
        }
    }
    return max;
};

let n = (arr) => {
    let max = 0;
    let maxEnd = 0;
    for (let i = 0; i < arr.length; i++) {
        maxEnd = Math.max(maxEnd + arr[i], 0);
        max = Math.max(max, maxEnd);
    }
    return max;
}

console.log(n3(nums));
console.log(n2_1(nums));
console.log(n2_2(nums));
console.log(n(nums));
