const fs = require('fs');

const wordReg = /[a-zA-Z]\w+/g;

fs.readFile('F:\\doc\\es6.html', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const content = data.toString();
    // const content = 'abc aaa ddd';
    const dictionary = {};

    let result;

    while (result = wordReg.exec(content)) {
        const word = result[0].toLowerCase();
        if (dictionary[word]) {
            dictionary[word] += 1;
        } else {
            dictionary[word] = 1;
        }
    }
    console.log(dictionary);
    console.log('单词个数', Object.keys(dictionary).length);
    console.log('最常用的单词排序', Object.entries(dictionary).sort((a, b) => b[1] - a[1]).slice(0, 100));
});