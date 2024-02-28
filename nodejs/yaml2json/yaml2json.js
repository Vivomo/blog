//使用js-yaml库
const fs = require('fs');
const yaml = require('js-yaml');

//读取.meta文件中的内容
let metaContent = fs.readFileSync('./Samurai.png.meta', 'utf8');

//将.meta文件内容转换为JavaScript对象
let metaObject = yaml.load(metaContent);

//将JavaScript对象转换为JSON字符串
let json = JSON.stringify(metaObject);

console.log(json);