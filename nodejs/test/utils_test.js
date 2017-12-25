const {
    getFilesByPath
} = require('../util/fileUtil');

let path1 = 'G:\\temp';

let result = getFilesByPath(path1);

console.log(result.length);