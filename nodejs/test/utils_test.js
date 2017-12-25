const {
    getFilesByPath,
    getSafeFilesByPath
} = require('../util/fileUtil');

let path1 = 'G:\\temp';

// console.time('a');
let result = getFilesByPath(path1);
console.log(result);
// console.timeEnd('a');
