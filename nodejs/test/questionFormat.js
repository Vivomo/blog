const fs = require('fs');
const {transliterate: pinyin} = require('transliteration');

let dataStr = fs.readFileSync('../ignore/base.txt', 'utf8')
let data = JSON.parse(dataStr);

let singleChoice = [];
let multipleChoice = [];
let tf = [];

let addBrackets = str => `(${str})`;

Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) {
        multipleChoice.push({
            q: k,
            a: v.map(addBrackets).join('')
        })
    } else if (v.length === 1) {
        tf.push({q:k, a: v});
    } else {
        singleChoice.push({q:k, a: v});
    }
});

console.log(Object.keys(data).length);

console.log(singleChoice.length, multipleChoice.length, tf.length);

let pinyinSort = (a, b) => pinyin(a.q).localeCompare(pinyin(b.q));

[singleChoice, multipleChoice, tf].forEach(arr => {
    arr.sort(pinyinSort);
});

let result = '单选题\n\n';
let format = arr => arr.map(({q, a}, index) => `${index}.${q}-->${a}`).join('\n');
result += format(singleChoice);
result += '\n\n多选题\n\n';
result += format(multipleChoice);
result += '\n\n判断题\n\n';
result += format(tf);


fs.writeFileSync('../ignore/result.txt', result);