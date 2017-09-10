const fs = require('fs');

const contentReg = />([^<]+)</g; // JS 不支持 (?<=) 所以只有 (?=)没用
const wordReg = /[a-zA-Z]\w+/g;

fs.readFile('F:\\doc\\es6.html', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const html = data.toString();
    countWordByReg(html);
});

/**
 * 使用正则来统计单词
 * @param html
 */
function countWordByReg(html) {
    const dictionary = {};

    let result;

    while (result = contentReg.exec(html)) {
        const content = result[1].toLowerCase();
        const words = content.match(wordReg);
        if (words) {
            words.forEach((word) => {
                if (dictionary[word]) {
                    dictionary[word] += 1;
                } else {
                    dictionary[word] = 1;
                }
            })
        }
    }
    printDictionary(dictionary)
}



function countWordByFiniteState(html) {

}

/**
 * 打印统计结果
 * @param dictionary
 */
function printDictionary(dictionary) {
    console.log(dictionary);
    console.log('单词个数', Object.keys(dictionary).length);
    console.log('最常用的单词排序', Object.entries(dictionary).sort((a, b) => b[1] - a[1]).slice(0, 100));
}
