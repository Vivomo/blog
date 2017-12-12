const fs = require('fs');

let filePath = `C:\\`;

class File {
    constructor(data) {
        Object.assign(this, data);
    }
}


let tree = new File({
    children: [],
    size: 0,
    name: 'root'
});


function createFilesArray(path, tree) {
    let files = fs.readdirSync(path);
    tree.children = files.map((filename) => {
        let filePath = path + '\\' + filename;
        let stats = fs.statSync(filePath);
        let file = new File({
            name: filename,
            size: stats.size,
        });
        if (stats.isDirectory()) {
            createFilesArray(filePath, file);
        }
        tree.size += file.size;
        return file;
    });
}

console.time('f');
createFilesArray(filePath, tree);
console.timeEnd('f');
console.log(tree.size);
// console.log(JSON.stringify(tree));
