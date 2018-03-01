console.log(Math.random());
let arr1 = [];
let arr2 = [];
console.time('r')
for (let i = 0; i < 40000000; i++) {
    arr1.push(~~(Math.random() * 10000) / 10000);
}
console.timeEnd('r')

console.time('r1')
for (let i = 0; i < 10000000; i++) {
    let num = Math.random();
    num *= 10000;
    arr2.push(~~num / 10000);
    num %= 1;
    num *= 10000;
    arr2.push(~~num / 10000);
    num %= 1;
    num *= 10000;
    arr2.push(~~num / 10000);
    num %= 1;
    num *= 10000;
    arr2.push(~~num / 10000);
}
console.timeEnd('r1')

console.log(arr1.slice(0,8),arr2.slice(0, 8));

//效率提高的很少