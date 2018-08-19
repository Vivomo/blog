let max = (arr) => {
    let money = 0;
    for (let i = 1; i < arr.length; i++) {
        let diff = arr[i] - arr[i-1];
        if (diff > 0) {
            money += diff
        }
    }
    return money;
};

console.log(max([7,1,5,3,6,4]))
console.log(max([1,2,3,4,5]))
console.log(max([7,6,4,3,1]))