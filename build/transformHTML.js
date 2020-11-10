const jsdom = require('jsdom');
const path = require('path');
const fs = require('fs');

const {getFilesByPath} = require('../nodejs/util/fileUtil');
const {parseScript, parseBodyData, parseViewport, parseCSS, createBlog, parseContent} = require('./utils');

const { JSDOM } = jsdom;

const inputPath = '../src/html';
const outputPath = '../_posts';

let htmlPaths = getFilesByPath(path.join(__dirname, inputPath));

htmlPaths.forEach((htmlPath) => {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    let {document} = (new JSDOM(html)).window;

    let bodyData = parseBodyData(document);
    if (!bodyData.date) {
        console.log(htmlPath + ' no date');
        return;
    }
    if (bodyData.done === 'false') {
        return;
    }
    let blog = {
        js: parseScript(document),
        css: parseCSS(document),
        layout: bodyData.layout,
        viewport: parseViewport(document),
        title: document.title,
        content: parseContent(document.body.innerHTML),
    };

    let targetPath = path.join(__dirname, outputPath, bodyData.date + '-' + path.basename(htmlPath));
    fs.writeFile(targetPath, createBlog(blog), (err) => {
        if (err) {
            console.log(err)
        }
    })
});




