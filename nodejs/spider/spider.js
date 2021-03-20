const https = require('https');
const DomParser = require('dom-parser');
const fs = require('fs');
const request = require('request');

const parser = new DomParser();

const startUrl = 'https://www.mh4321.com/comic/7991';
const origin = 'https://www.mh4321.com';
const headers = {
    Referer: origin
};

https.get(startUrl, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        // console.log(rawData);
        let dom = parser.parseFromString(rawData);
        let links = dom.getElementsByClassName('j-chapter-link');
        links.forEach((link) => {
            let href = origin + link.getAttribute('href');
            download(href, link.textContent.trim());
        });
    });
});

const download = (href, title) => {
    let dirPath = '../../ignore/step/' + title;
    // fs.mkdirSync(dirPath);
    https.get(href, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            let dom = parser.parseFromString(rawData);
            let imgList = dom.getElementsByClassName('lazy-read');
            imgList.forEach((img, index) => {
                let url = img.getAttribute('data-original');
                let name = img.getAttribute('alt') || index;
                if (url.endsWith('.jpg')) {
                    requestControl.add(url, dirPath + '/' + name);
                }
            });
        });
    });
};

const requestControl = {
    stack: [],
    limit: 10,
    onRequest: 0,
    failed: [],
    add(url, filePath) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
            console.log(filePath, 'exist');
            return;
        }
        this.stack.push({ url, filePath });
        this.check()
    },
    check() {
        if (this.onRequest < this.limit && this.stack.length > 0) {
            let { url, filePath } = this.stack.shift();
            this.downloadImg(url, filePath);
            this.onRequest++;
        }
    },
    downloadImg(url, filePath, count = 1) {
        try {
            request.get({
                url,
                headers
            }, (err) => {
                if (err) {
                    console.log(err)
                    console.error(filePath, '失败次数', count);
                    if (count === 3) {
                        this.onRequest--;

                        // this.failed.push({url, filePath})
                        this.check();
                    } else {
                        this.downloadImg(url, filePath, count + 1);
                    }
                } else {
                    console.log('done:', filePath);
                    this.onRequest--;
                    this.check();
                }
            }).pipe(fs.createWriteStream(filePath));
        } catch (e) {
            console.error('---------------------------');
            console.error(e);
            console.error('---------------------------');
        }
    }
};

