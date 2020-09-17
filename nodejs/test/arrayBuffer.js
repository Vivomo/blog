const fs = require('fs');

let buff = new ArrayBuffer(8 * 1024);
let arr = new Int16Array(buff);

console.log(arr[1]);

arr[1] = 3;

// fs.writeFileSync('D:\\code\\git\\blog\\ignore\\buffer.b', Buffer.from(arr));

let compress = (arr) => {
    let result = [];
    let temp = 0;
    arr.forEach((item, index) => {
        temp += item << (15 - index % 16);
        if (index % 16 === 15) {
            result.push(temp);
            temp = 0;
        }
    });
    return result;
};

// let a = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
// console.log(compress(a))

console.log(Buffer.from([10]))
console.log(Buffer.from([255]))
console.log(Buffer.from(new Int16Array([1023]).buffer));