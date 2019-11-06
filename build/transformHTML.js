const jsdom = require('jsdom');
const path = require('path');
const fs = require('fs');

const {getFilesByPath} = require('../nodejs/util/fileUtil');
const {parseScript, parseBodyData, parseViewport, parseCSS, createBlog} = require('./utils');

const { JSDOM } = jsdom;

const inputPath = '../src/html';
const outputPath = './test';

let htmlPaths = getFilesByPath(path.join(__dirname, inputPath));

htmlPaths.forEach((htmlPath) => {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    let {document} = (new JSDOM(html)).window;

    let bodyData = parseBodyData(document);
    if (!bodyData.date) {
        throw htmlPath + ' no date';
    }
    let blog = {
        js: parseScript(document),
        css: parseCSS(document),
        layout: bodyData.layout,
        viewport: parseViewport(document),
        title: document.title,
        content: document.body.innerHTML,
    };

    // console.log(parseBodyData(document));
    console.log(createBlog(blog));

    fs.writeFile(path.join(__dirname, outputPath, bodyData.date + '-' + path.basename(htmlPath)), createBlog(blog), (err) => {
        if (err) {
            console.log(err)
        }
    })
});




