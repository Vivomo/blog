let http = require('http');
let fs = require('fs');

let root = '';
let htmlHeader = {
    'content-type': 'text/html;charset="utf-8"'
};

http.createServer((req, res) => {
    let url = req.url;
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
        res.writeHeader(httpCode, htmlHeader);
        res.write(content);
        res.end();
    });

}).listen(8888);

console.log('服务器开启成功');
