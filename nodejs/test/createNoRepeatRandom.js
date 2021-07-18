let createNoRepeatRandom = (count, max) => {
    if (count > max) {
        throw 'invalid args'
    }
    let result = [];
    for (let i = 0; i < count; i++) {
        let ranInt = ~~(Math.random() * max);
        let temp = result[i] ??= i;
        result[i] = result[ranInt] ??= ranInt;
        result[ranInt] = temp;
    }
    return result.slice(0, count);
}


console.log(createNoRepeatRandom(5, 10));
console.log(createNoRepeatRandom(7, 10));
console.log(createNoRepeatRandom(9, 10));

