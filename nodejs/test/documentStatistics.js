const fs = require('fs');

let filePath = `C:\\Users\\Administrator\\AppData`;

class File {
    constructor(data) {
        Object.assign(this, data);
    }
}


let tree = new File({
    children: [],
    value: 0,
    name: 'root'
});


function createFilesArray(path, tree) {
    let files;
    try {
        files = fs.readdirSync(path);
    } catch (e) {
        // 无权限
        console.log(e + path);
        return;
    }
    tree.children = files.map((filename, index) => {
        let filePath = path + '\\' + filename;
        let stats;
        try {
            stats = fs.statSync(filePath);
        } catch (e) {
            console.log(e + filePath);
            return {
                name: '无权限文件' + index,
                value: 0
            }
        }
        let file = new File({
            name: filename,
            value: stats.size,
        });
        if (stats.isDirectory()) {
            createFilesArray(filePath, file);
        }
        tree.value += file.value;
        return file;
    });
}

console.time('f');
createFilesArray(filePath, tree);
console.timeEnd('f');

fs.writeFile('../../ignore/AppData.json', JSON.stringify(tree), (err) => {
    if (!err) {
        console.log('write');
    }
});