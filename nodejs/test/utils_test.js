const {
    getFilesByPath,
    getSafeFilesByPath
} = require('../util/fileUtil');

let path1 = 'F:\\';

// console.time('a');
// let result = getFilesByPath(path1);
// console.timeEnd('a');

console.time('b');
let result2 = getSafeFilesByPath(path1);
console.timeEnd('b');