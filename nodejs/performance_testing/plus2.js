const MAX_NUM = 1000000;
function noop(num) {
    ~~Math.sqrt(num);
}
console.time('a');
for (let i = 0; i < MAX_NUM; i++) {
    noop(i);
}
console.timeEnd('a');


console.time('b');
for (let i = 0; i < MAX_NUM; i += 2) {
    noop(i);
}
console.timeEnd('b');