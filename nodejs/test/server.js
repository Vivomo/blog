let http = require('http');
let fs = require('fs');

let root = '';

const getContentType = (suffix) => {
    let suffixMap = {
        js: 'text/javascript',
        css: 'text/css',
        html: 'text/html'
    };
    return {
        'content-type': suffixMap[suffix]
    } || {};
};

http.createServer((req, res) => {
    let url = req.url.substr(1);
    let file = root + url;
    let httpCode = null;
    let content = null;
    console.log(url);

    fs.readFile(file, function (err, data) {
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
