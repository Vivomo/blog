const mapStream = require('map-stream');
const vfs = require('vinyl-fs');
const glob = require('glob');
const fs = require('fs');
const cfg = {
    baseDir: '',

};

const jsonStr = fs.readFileSync('./ignore/zh.json', 'utf8');
const jsonObj = JSON.parse(jsonStr);

const targetReg = /formatMessage\(/g;
const emptyReg = /\s/;

fs.readFile('./ignore/index.tsx', 'utf8', (err, content) => {
    if (err) {
        console.error(err)
    } else {
        let indexList = [...content.matchAll(targetReg)].map(item => item.index);
        console.log(indexList);
    }
});

const transformIndexList = (indexList, content) => {
    return indexList.map((targetIndex) => {
        let beforeIndex = targetIndex - 1;
        while (beforeIndex >= 0) {
            if (emptyReg.test(content[beforeIndex])) {
                beforeIndex--;
                continue;
            }
            
        }
    });
};


// const log = (file) => {
//     console.log(file.path);
// }
//
// let r = glob('../*.js', {}, (err, files) => {
//     console.log(files)
// });
//
// console.log(r)