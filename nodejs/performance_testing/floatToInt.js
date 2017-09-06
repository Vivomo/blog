
function getRandomArray(len, max=100000) {
    var arr = [];
    for (let i = 0; i < len; i++) {
        arr[i] = Math.random() * max;
    }
    return arr;
}

var arr = getRandomArray(10000000);
const floor = Math.floor;

console.time('parseInt');
arr.forEach(item => parseInt(item));
console.timeEnd('parseInt');

console.time('~~');
arr.forEach(item => ~~item);
console.timeEnd('~~');

console.time('floor');
arr.forEach(item => Math.floor(item));
console.timeEnd('floor');

/**
 * Node运行结果 ~~最快, parseInt次之
 * 但是在chrome 里面 parseInt 最慢, 比~~ 将近慢 40倍
 * chrome 和 Node ~~ 都比 Math.floor 2.5至3倍
 * */