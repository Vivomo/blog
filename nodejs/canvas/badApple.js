const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const {getFilesByPath} = require('../util/fileUtil');
const {compress} = require('./utils');

let pixelValue = 10;
let width = 960;
let height = 720;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let letterList = [];
let imgCount = 0;
let numReg = /\d+/;




let getImageData =  (startX = 0, startY = 0, width, height) => {
    return ctx.getImageData(startX, startY, width, height);
};


let imgToLetter = (pathList) => {
    let imgPath = pathList.pop();
    if (!imgPath) {
        return;
    }
    let imgIndexInfo = numReg.exec(imgPath);
    let imgIndex;
    if (imgIndexInfo) {
        imgIndex = imgIndexInfo[0] - 1;
    } else {
        console.log('error path', imgPath);
        return;
    }
    loadImage(imgPath).then((img) => {
        ctx.drawImage(img, 0, 0);

        let wBlockCount = Math.ceil(width / pixelValue);
        let hBlockCount = Math.ceil(height / pixelValue);

        let letterArea = [];

        let wRemainder = width % pixelValue;
        let hRemainder = height % pixelValue;
        let lastWidth = wRemainder === 0 ? pixelValue : wRemainder;
        let lastHeight = hRemainder === 0 ? pixelValue : hRemainder;


        for (let j = 0; j < hBlockCount; j++) {
            for (let i = 0; i < wBlockCount; i++) {
                let w = i === wBlockCount - 1 ? lastWidth : pixelValue;
                let h = j === hBlockCount - 1 ? lastHeight : pixelValue;
                let imageData = getImageData(i * pixelValue, j * pixelValue, w, h);
                let color = 0;
                imageData.data.forEach((item, index) => {
                    if (index % 4 !== 3) {
                        color += item;
                    }
                });
                let block = color / 3 / (imageData.data.length / 4) > 128 ? 0 : 1;
                letterArea.push(block);
            }
        }
        letterList[imgIndex] = compress(letterArea);
        imgCount--;
        if (imgCount > 0) {
            imgToLetter(imgPathList);
        } else {
            writeFile();
            console.timeEnd('time');
        }
        console.log(imgCount);

    });
};

let writeFile = () => {
    let arr = new Int8Array(letterList.flat(1));
    fs.writeFileSync('D:\\code\\git\\blog\\ignore\\buffer.b', Buffer.from(arr));
};

console.time('time');
let imgPathList = getFilesByPath('D:\\AppData\\bad_apple');
imgCount = imgPathList.length;

imgToLetter(imgPathList);



