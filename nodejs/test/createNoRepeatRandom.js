let randomInt = (max) => ~~(Math.random() * max);

let swap = (arr, index1, index2) => {
    let temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}
let mock = [1, 4, 4, 8, 2];
let createNoRepeatRandom = (count, max) => {
    if (count > max) {
        throw 'invalid args'
    }
    let result = [];
    for (let i = 0; i < count; i++) {
        let item = randomInt(max);
        if (result[i] === undefined) {
            result[i] = i;
        }

        if (result[item] === undefined) {
            result[item] = item;
        }
        swap(result, i, item);
    }
    return result.slice(0, count);
}



// console.log(createNoRepeatRandom(5, 10));
// console.log(createNoRepeatRandom(7, 10));
// console.log(createNoRepeatRandom(9, 10));
