const fs = require('fs');

let createFile = (num) => {
    let buff = Buffer.from(new Uint8Array(10000000))
    for (let i = 0; i < num; i++) {
        fs.writeFile(`../ignore/io/${i}.txt`, buff, { encoding: 'binary'}, () => {
            console.log('t:', Date.now() - start);
        });
    }
    console.log('-------------------')
}
let start = Date.now();


let readFile = (num) => {
    for (let i = 0; i < num; i++) {
        fs.readFile(`../ignore/io/${i}.txt`, { encoding: 'utf8' },(err, data) => {
            console.log('t:', Date.now() - start);
        });
    }
}

let readFileLimit = (num, limit) => {
    let paths = Array(num).fill(0).map((_, index) => `../ignore/io/${index}.txt`);
    let count = 0;
    let read = () => {
        let path = paths.pop();
        if (path) {
            count++
            fs.readFile(path, { encoding: 'utf8' },(err, data) => {
                count--;
                console.log('t:', Date.now() - start);
                read();
            });
            if (count <= limit) {
                read();
            }
        }
    }
    read();
}

let readFileAsync = (num) => {
    for (let i = 0; i < num; i++) {
        let data = fs.readFileSync(`../ignore/io/${i}.txt`, { encoding: 'utf8' });
        console.log('t:', Date.now() - start);
    }
}

// createFile(1000)
// readFile(2000)
readFileLimit(2000, 10)
// readFileAsync(1000)