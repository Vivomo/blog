const fs = require('fs');
const path = require('path');

function removeDir(dir) {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath);
        if (stat.isDirectory()) {
            removeDir(newPath);
        } else {
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir);
}

const newRoot = './dist';

if (fs.existsSync(newRoot)) {
    removeDir(newRoot);
}

fs.renameSync('./build', newRoot);