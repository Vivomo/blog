const fs = require('fs');

const contentReg = />([^<]+)</g; // JS 不支持 (?<=) 所以只有 (?=)没用
const wordReg = /[a-zA-Z]+/g;

fs.readFile('F:\\doc\\es6.html', function (err, data) {
    if (err) {
        return console.error(err);
    }
    const html = data.toString();

    // 测试结果 reg优
    console.time('reg');
    countWordByReg(html);
    console.timeEnd('reg');

    console.time('state');
    countWordByFiniteState(html);
    console.timeEnd('state')
});

/**
 * 使用正则来统计单词
 * @param html
 */
function countWordByReg(html) {
    const dictionary = {};
    let result;

    while (result = contentReg.exec(html)) {
        const content = result[1];
        const words = content.match(wordReg);
        if (words) {
            words.forEach(word => addWordToDic(word, dictionary));
        }
    }
    printDictionary(dictionary)
}


/**
 * 有限状态机方式来统计单词
 * @param html
 */
function countWordByFiniteState(html) {
    const contentBeginToken = '>';
    const contentEndToken = '<';
    const letterReg = /[a-zA-Z]/;

    const tagState = 0;
    const contentState = 1;
    const wordState = 2;

    let state = tagState;
    let wordStartIndex = -1;
    const dictionary = {};
    
    for (let i = 0, l = html.length; i < l; i++) {
        let char = html[i];
        
        switch (state) {
            case tagState:
                if (char === contentBeginToken) {
                    state = contentState;
                }
                break;
            case contentState:
                if (char === contentEndToken) {
                    state = tagState;
                } else if (char.match(letterReg)) {
                    wordStartIndex = i;
                    state = wordState;
                }
                break;
            default:
                if (!char.match(letterReg)) {
                    state = char === contentEndToken ? tagState : contentState;
                    addWordToDic(html.substring(wordStartIndex, i), dictionary);
                }
        }
    }
    printDictionary(dictionary);
}

/**
 * 打印统计结果
 * @param dictionary
 */
function printDictionary(dictionary) {
    console.log('单词个数', Object.keys(dictionary).length);
    console.log('最常用的单词排序', Object.entries(dictionary).sort((a, b) => b[1] - a[1]).slice(0, 100));
}

/**
 * 将单词加入字典
 * @param word
 * @param dic
 */
function addWordToDic(word, dic) {
    word = word.toLowerCase();
    if (dic[word]) {
        dic[word] += 1;
    } else {
        dic[word] = 1;
    }
}