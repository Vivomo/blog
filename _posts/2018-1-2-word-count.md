---
layout: blog
title: 看懂ES6规范需要掌握多少词汇
description: 看懂ES6规范需要掌握多少词汇
keywords: 看懂ES6规范需要掌握多少词汇 NodeJS 单词统计
tags: text
---

### JS的编程规范
JS编程规范相对于JS可以说等同于新华字典相对汉字. 很多JS一些疑难点都在编程规范里面可以找到
这是ES5 中文在线文档 http://yanhaijing.com/es5/ 目前没找到ES6的.
这个是 ES6英文的文档 http://www.ecma-international.org/ecma-262/6.0/
然后我想到了一个问题 完全看懂这个文档需要多大的词汇量.所以就写了个程序统计了一下

下面是代码, 我用了两种方法统计单词, 理论上讲我觉得应该是有限状态机那种方式更高效, 但事实并非如此.
应该是NodeJS的优化机制导致吧, 有相关看法欢迎留言

```js
const fs = require('fs');

const contentReg = />([^<]+)</g; // JS 不支持 (?<=) 所以只有 (?=)没用
const wordReg = /[a-zA-Z]+/g;
const url = 'F:\\doc\\es6.html'; // 打开上面的页面ctrl+s保存到本地, 复制其文件路径

fs.readFile(url, function (err, data) {
    if (err) {
        return console.error(err);
    }
    const html = data.toString();

    
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
```


