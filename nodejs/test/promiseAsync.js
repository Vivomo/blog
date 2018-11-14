// Macro task & Micro task
console.log(1);
setTimeout(() => {
    console.log(4)
});
let p = new Promise((resolve) => {
    console.log(2);
    resolve(3)
});

p.then((res) => {
    console.log(res);
    return 3.5
}).then((res) => {
    console.log(res)
});
console.log(2.5);


let p2 = new Promise((resolve, reject) => {
    reject('reject');
    console.log('after reject'); // will run
});

p2.then((res) => {
    console.log('res1', res)
}, (res) => {
    console.log('res2', res)
});