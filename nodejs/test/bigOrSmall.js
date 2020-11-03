let count = 480*20;
let lose = 0;
let max = 0;
let result = [];
let random = Math.random;

console.time('a');
for (let i = 0; i < count; i++) {
    if (random() < 0.5) {
        result.push(lose);
        max = Math.max(max, lose);
        lose = 0;
    } else {
        lose++;
    }
}
console.log('max', max);
console.log('count', result.length);
console.log(result.slice(0, 100));
console.timeEnd('a');