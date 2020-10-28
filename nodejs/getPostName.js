let fs = require('fs');
let path = require('path');
let {getFilesByPath} = require('./util/fileUtil');

let nameReg = /-([a-z-]+)\.(html|md)$/i;
let targetPath = path.join(__dirname, '../_posts');
console.log(targetPath);
let paths = getFilesByPath(targetPath);
console.log(paths)
let result = {};

paths.forEach(item => {
    let r = nameReg.exec(item);
    if (r) {
        result[r[1]] = {
            content: ''
        };
    } else {
        console.log(item)
    }
});

console.log(result)
// console.log(nameReg.exec(`D:\\code\\git\\blog\\_posts\\2015-12-10-hanoi.html`)[1]);