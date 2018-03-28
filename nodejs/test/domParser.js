let fs = require('fs')
let DomParser = require('dom-parser');
let parser = new DomParser();

fs.readFile('../../test/eval.html', 'utf8', (err, html) => {
    let dom = parser.parseFromString(html);
    console.log(dom.getElementsByTagName('title')[0].innerHTML);
});