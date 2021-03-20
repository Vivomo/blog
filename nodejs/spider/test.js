const fs = require('fs');
const request = require('request');


let url = 'https://dongman.6868dh.com/ssdongman/ssmhzhangjieDecember10/528307.jpg';

request({
    url,
    headers: {
        Referer: 'https://www.mh4321.com/'
    }
}).pipe(fs.createWriteStream('./528307.jpg'));