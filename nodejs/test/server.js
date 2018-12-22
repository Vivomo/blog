let http = require('http');
let fs = require('fs');
let path = require('path');

let root = '.';
const DEFAULT_URL = '/index.html';

const getContentType = (suffix) => {
    let suffixMap = {
        js: 'text/javascript',
        css: 'text/css',
        html: 'text/html',
        ico: 'image/x-icon'
    };
    return suffixMap[suffix] ?
        {
            'content-type': suffixMap[suffix]
        }
        :
        {};
};

http.createServer((req, res) => {
    let url = req.url.substr(1) || DEFAULT_URL;
    let filePath = path.resolve(__dirname, url);
    let httpCode = null;
    let content = null;
    console.log(url, filePath);

    fs.readFile(filePath, function (err, data) {
        if (err) {
            httpCode = 404;
            content = '404';
        } else {
            httpCode = 200;
            content = data;
        }
        let suffix = url.substr(url.lastIndexOf('.') + 1);
        res.writeHeader(httpCode, getContentType(suffix));
        res.write(content);
        res.end();
    });

}).listen(8888);

console.log('服务器开启成功');
