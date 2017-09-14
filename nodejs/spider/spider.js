const http = require('http');

http.get('http://www.jobbole.com/', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        console.log(rawData);
    });
});