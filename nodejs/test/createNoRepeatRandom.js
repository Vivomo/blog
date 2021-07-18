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


let createNoRepeatRandom2 = (count, max) => {
    if (count > max) {
        throw 'invalid args'
    }
    let map = new Map();
    let result = Array(count);
    for (let i = 0; i < count; i++) {
        let ranInt = ~~(Math.random() * max);
        let temp = result[i] ??= i;
        if (ranInt < count) {
            result[i] = result[ranInt] ??= ranInt;
            result[ranInt] = temp;
        } else {
            temp = map.get(ranInt) ?? ranInt;
            map.set(ranInt, result[i])
            result[i] = temp;
        }
    }
    return result;
}

console.log(createNoRepeatRandom(5, 10));
console.log(createNoRepeatRandom(7, 10));
console.log(createNoRepeatRandom(9, 10));

console.log(createNoRepeatRandom2(5, 10));
console.log(createNoRepeatRandom2(7, 10));
console.log(createNoRepeatRandom2(9, 10));