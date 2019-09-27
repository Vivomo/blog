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
}

console.log(n3(nums));
console.log(n2_1(nums));
