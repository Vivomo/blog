const {transliterate: pinyin} = require('transliteration');
console.log(pinyin('系统找不到指定的路径'))
let arr = '系统找不到指定的路径。'.split('')
    .sort((a, b) => pinyin(a).localeCompare(pinyin(b)))
console.log(arr);