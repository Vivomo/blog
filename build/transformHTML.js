const jsdom = require('jsdom');
const path = require('path');
const fs = require('fs');

const {getFilesByPath} = require('../nodejs/util/fileUtil');
const {parseScript, parseBodyData, parseViewport, parseCSS, createBlog} = require('./utils');

const { JSDOM } = jsdom;

const inputPath = './test';
const outputPath = './test';

let htmlPaths = getFilesByPath(path.join(__dirname, inputPath));

htmlPaths.forEach((htmlPath) => {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    let {document} = (new JSDOM(html)).window;

    let bodyData = parseBodyData(document);
    let blog = {
        js: parseScript(document),
        css: parseCSS(document),
        layout: bodyData.layout || 'blank',
        viewport: parseViewport(document),
        title: document.title,
        content: document.body.innerHTML,
    };

    // console.log(parseBodyData(document));
    console.log(blog);
    console.log(createBlog(blog));
    // console.log(document.body.innerHTML);
});




