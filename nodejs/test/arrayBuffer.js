const fs = require('fs');

let a = Int16Array.from([2048, 1025]);
console.log( Buffer.from(a).buffer);
console.log( Buffer.from(a.buffer));
console.log(a.buffer);


// let a = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
// console.log(compress(a))

// console.log(Buffer.from([10]))
// console.log(Buffer.from([255]))
// console.log(Buffer.from(new Int16Array([6912]).buffer));


// let b = Buffer.from(Int16Array.from([6912]).buffer);

// let a = Array.from(Int16Array.from(b));
// let f = fs.readFileSync('D:\\code\\git\\blog\\ignore\\buffertest.b');
// console.log(new Int16Array(f))

// let a = Int8Array.from([1, 1]);
// console.log(Int16Array.from(a));