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
    let files;
    try {
        files = fs.readdirSync(path);
    } catch (e) {
        // 无权限
        return;
    }
    tree.children = files.map((filename, index) => {
        let filePath = path + '\\' + filename;
        let stats;
        try {
            stats = fs.statSync(filePath);
        } catch (e) {
            return {
                name: '无权限文件' + index,
                size: 0
            }
        }
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

fs.writeFile('../../ignore/c.json', JSON.stringify(tree), (err) => {
    if (!err) {
        console.log('write');
    }
});