const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const images = require('images');
const {getFilesByPath} = require('../util/fileUtil');
const {compress} = require('./utils');

let inputPath = 'D:\\code\\git\\blog\\ignore\\ex_jljt\\';
let outputPath = 'D:\\code\\git\\blog\\ignore\\jljt.b';

let exImg = images(`${inputPath}1.jpg`);
let width = exImg.width();
let height = exImg.height();
let pxWidth = width * 4;
let tempData = new Uint8Array(pxWidth * height);


const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let letterList = [];
let imgCount = 0;
let numReg = /\d+/;
let toleranceValue = 20;
let pixelValue = 10;
let wBlockCount = Math.ceil(width / pixelValue);
let hBlockCount = Math.ceil(height / pixelValue);

/**
 * 获取容差
 * @param imageData
 * @param index1
 * @param index2
 * @returns {number}
 */
let getTolerance = (imageData, index1, index2) => {
    return Math.max(
        Math.abs(imageData[index1] - imageData[index2]),
        Math.abs(imageData[index1 + 1] - imageData[index2 + 1]),
        Math.abs(imageData[index1 + 2] - imageData[index2 + 2])
    )
};

/**
 * 如果容差大于指定值则在 临时数据中记录一下,
 * ( 这不算函数, 算一个宏吧, 挺违背函数单一职责的 ┑(￣Д ￣)┍)
 * @param imageData from canvas
 * @param tempData 临时存储描边点的数组
 * @param currentIndex 当前坐标
 * @param compareIndex 比较的坐标
 * @returns {boolean} 是否大于容差
 */
let stockIfGtToleranceMacro = (imageData, tempData, currentIndex, compareIndex) => {
    if (tempData[compareIndex] !== 0) {
        let tolerance = getTolerance(imageData, currentIndex, compareIndex);
        if (tolerance > toleranceValue) {
            tempData[currentIndex] = tempData[currentIndex + 1] = tempData[currentIndex + 2] = 0;
            return true
        }
    }
    return false;
};

let getStockData = (ctx) => {
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    tempData.fill(255);

    for (let i = 0; i < height; i++) {
        for (let j = pxWidth * i, _w = pxWidth * (i + 1); j < _w; j += 4) {
            if (i > 0) {
                let topIndex = j - pxWidth;
                if (stockIfGtToleranceMacro(data, tempData, j, topIndex)) {
                    continue;
                }
            }

            if (j > 0) {
                let leftIndex = j - 4;
                if (stockIfGtToleranceMacro(data, tempData, j, leftIndex)) {
                    continue;
                }
            }

            if (i > 0 && j > 0) {
                let leftTopIndex = j - pxWidth - 4;
                stockIfGtToleranceMacro(data, tempData, j, leftTopIndex)
            }
        }
    }

    return tempData;
};

let validWhite = value => value === 255;


let imgToLetter = (pathList) => {

    let imgPath = pathList.pop();
    let imgIndex = numReg.exec(imgPath)[0] - 1;

    loadImage(imgPath).then((img) => {
        ctx.drawImage(img, 0, 0);

        let stockData = getStockData(ctx);
        let letterArea = [];

        for (let j = 0; j < hBlockCount; j++) {
            for (let i = 0; i < wBlockCount; i++) {
                let isWhite = true;
                for (let p = 0; p < pixelValue; p++) {
                    let sx = (j * pixelValue + p) * pxWidth + i * pixelValue * 4;
                    let lineData = stockData.slice(sx, sx + pixelValue * 4);
                    isWhite = lineData.every(validWhite);
                    if (!isWhite) {
                        break;
                    }
                }
                letterArea.push(isWhite ? 0 : 1);
            }
        }
        letterList[imgIndex] = compress(letterArea);
        imgCount--;
        console.log(imgCount);
        if (imgCount > 0) {
            imgToLetter(imgPathList);
        } else {
            writeFile();
            console.timeEnd('time');
        }
    });
};

let writeFile = () => {
    let arr = new Int8Array(letterList.flat(1));
    fs.writeFileSync(outputPath, Buffer.from(arr));
};

console.time('time');


let imgPathList = getFilesByPath(inputPath);
imgCount = imgPathList.length;

imgToLetter(imgPathList);
