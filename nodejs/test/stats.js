const fs = require('fs');

let path1 = 'G:\\';


let s1 = fs.statSync(path1);


[s1].forEach((stats) => {
    // console.log("stats.isFile() ->" + stats.isFile())
    // console.log("stats.isDirectory() -> " + stats.isDirectory())
    console.log("stats.isBlockDevice() ->" + stats.isBlockDevice())
    console.log("stats.isCharacterDevice()" + stats.isCharacterDevice())
    console.log("stats.isSymbolicLink() -> "+stats.isSymbolicLink())
    console.log("stats.isFIFO() ->" + stats.isFIFO())
    console.log("stats.isSocket()-> " + stats.isSocket())
});


console.log(fs.statSync(path2));

// console.log(fs.readdirSync(path1))
// console.log(fs.readdirSync(path2))
