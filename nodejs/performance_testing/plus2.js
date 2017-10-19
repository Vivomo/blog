const MAX_NUM = 100000000;
function noop() {

}
console.time('a');
for (let i = 0; i < MAX_NUM; i++) {
    noop();
}
console.timeEnd('a');


console.time('b');
for (let i = 0; i < MAX_NUM; i += 2) {
    noop();
}
console.timeEnd('b');