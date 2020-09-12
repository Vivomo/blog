const {createCanvas, loadImage} = require('canvas');
const path = require('path');

let pixelValue = 10;
let width = 960;
let height = 720;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let imgPath = path.join(__dirname, '../../ignore/6186.jpg');

let compress = (arr) => {
    let result = [];
    let temp = 0;
    arr.forEach((item, index) => {
        temp += item << (index % 16);
        if (index % 16 === 15) {
            result.push(String.fromCharCode(temp));
            temp = 0;
        }
    });
    console.log(result.length)
    return result.join('');
};

loadImage(imgPath).then((img) => {
    ctx.drawImage(img, 0, 0);

    let wBlockCount = Math.ceil(width / pixelValue);
    let hBlockCount = Math.ceil(height / pixelValue);

    // let letterArea = new Array(hBlockCount).fill(0).map(_ => new Array(wBlockCount));
    let letterArea = [];

    let wRemainder = width % pixelValue;
    let hRemainder = height % pixelValue;
    let lastWidth = wRemainder === 0 ? pixelValue : wRemainder;
    let lastHeight = hRemainder === 0 ? pixelValue : hRemainder;

    let getImageData =  (startX = 0, startY = 0, width, height) => {
        return ctx.getImageData(startX, startY, width, height);
    };

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
    let result = compress(letterArea);
    console.log(result);

});

