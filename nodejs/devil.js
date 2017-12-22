const fs = require('fs');
const {
    simpleLock,
    simpleUnLock
} = require('./util/fileUtil');

let path = 'G:\\temp\\logo.jpg';
let txt = 'G:\\temp\\text.txt';

function lock(path) {
    fs.readFile(path, (err, data) => {
        let lockedData = simpleLock(data);
        fs.writeFile(path, lockedData);
    });
}

function unlock(path) {
    fs.readFile(path, (err, data) => {
        let unlockedData = simpleUnLock(data);
        fs.writeFile(path, unlockedData);
    });
}

// lock(txt);
// lock(path);

unlock(txt);
unlock(path);



