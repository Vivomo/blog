let readFile = () => {
    filePaths.forEach(path, () => {
        fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
            // 处理文件
        });
    })
}

let readFileSync = (num) => {
    filePaths.forEach(path, () => {
        let data = fs.readFileSync(`../ignore/io/${i}.txt`, { encoding: 'utf8' });
        // 处理文件
    })
}

let readFileLimit = (limit) => {
    let count = 0;
    let read = () => {
        let path = paths.pop();
        if (path) {
            count++
            fs.readFile(path, { encoding: 'utf8' },(err, data) => {
                count--;
                // 处理文件
                read();
            });
            if (count <= limit) {
                read();
            }
        }
    }
    read();
}

let readFileByStream = () => {
    // mapStream = require('map-stream');
    mapStream.pipe(filePaths)
        .pipe(() => {
            // 处理文件
        })
}

