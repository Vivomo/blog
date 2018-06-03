/**
 * 监测没有被引用的资源
 */

let {getFilesByPath} = require('./util/fileUtil');
let fs = require('fs');

let images = getFilesByPath('E:\\project\\qianniuRN\\app\\files\\images') || [];
console.log(images)
images = images.filter(path => path.includes('.'))
    .map(path => path.substring(path.lastIndexOf('\\') + 1).replace(/@\dx/i, ''));

let imageMap = {};

images.forEach((item) => {
    imageMap[item] = 0;
});

let allFilePath = getFilesByPath('E:\\project\\qianniuRN\\app\\pages').concat(getFilesByPath('E:\\project\\qianniuRN\\app\\ui-components')).filter(path => path.includes('.js'));
console.log('文件数', allFilePath.length)

allFilePath.forEach((path) => {
    let content = fs.readFileSync(path, 'utf-8');
    let temp = [];
    images.forEach((image) => {
         if (content.includes(image)) {
             temp.push(image)
         }
    });
    temp.forEach((image) => {
        let index = images.indexOf(image);
        if (index !== -1) {
            images.splice(index, 1);
        }
    })
});


console.log('未引用的图片', images);

