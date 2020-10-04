const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const images = require('images');
const {getFilesByPath} = require('../util/fileUtil');
const {compress} = require('./utils');


let cfg = {
    inputPath: 'D:\\code\\git\\blog\\ignore\\ex_jljt\\',
    outputPath: 'D:\\code\\git\\blog\\ignore\\jljt.b',
    name: ''
};

let App = (() => {

    let imgCount = 0;
    let tempData;
    let letterList = [];
    let numReg = /\d+/;

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

    let validWhite = value => value === 255;

    return {
        cfg: {
            toleranceValue: 20,
            pixelValue: 10
        },
        ctx: null,
        imgPathList: [],
        getStockData() {
            let {width, height, pxWidth} = this.cfg;
            let data = this.ctx.getImageData(0, 0, width, height).data;

            tempData.fill(255);

            for (let i = 0; i < height; i++) {
                for (let j = pxWidth * i, _w = pxWidth * (i + 1); j < _w; j += 4) {
                    if (i > 0) {
                        let topIndex = j - pxWidth;
                        if (this.stockIfGtToleranceMacro(data, tempData, j, topIndex)) {
                            continue;
                        }
                    }

                    if (j > 0) {
                        let leftIndex = j - 4;
                        if (this.stockIfGtToleranceMacro(data, tempData, j, leftIndex)) {
                            continue;
                        }
                    }

                    if (i > 0 && j > 0) {
                        let leftTopIndex = j - pxWidth - 4;
                        this.stockIfGtToleranceMacro(data, tempData, j, leftTopIndex)
                    }
                }
            }

            return tempData;
        },
        /**
         * 如果容差大于指定值则在 临时数据中记录一下,
         * ( 这不算函数, 算一个宏吧, 挺违背函数单一职责的 ┑(￣Д ￣)┍)
         * @param imageData from canvas
         * @param tempData 临时存储描边点的数组
         * @param currentIndex 当前坐标
         * @param compareIndex 比较的坐标
         * @returns {boolean} 是否大于容差
         */
        stockIfGtToleranceMacro(imageData, tempData, currentIndex, compareIndex) {
            if (tempData[compareIndex] !== 0) {
                let tolerance = getTolerance(imageData, currentIndex, compareIndex);
                if (tolerance > this.cfg.toleranceValue) {
                    tempData[currentIndex] = tempData[currentIndex + 1] = tempData[currentIndex + 2] = 0;
                    return true
                }
            }
            return false;
        },
        imgToByte(){
            let imgPath = this.imgPathList.pop();
            let imgIndex = numReg.exec(imgPath)[0] - 1;
            let {wBlockCount, hBlockCount, pixelValue, pxWidth} = this.cfg;

            loadImage(imgPath).then((img) => {
                this.ctx.drawImage(img, 0, 0);

                let stockData = this.getStockData();
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
                    this.imgToByte(this.imgPathList);
                } else {
                    this.save();
                    console.timeEnd('time');
                }
            });
        },
        save() {
            let arr = Int8Array.from(letterList.flat(1));
            fs.writeFileSync(this.cfg.outputPath, Buffer.from(arr));
        },
        init() {
            Object.assign(this.cfg, cfg);

            let exImg = images(`${this.cfg.inputPath}1.jpg`);
            let width = exImg.width();
            let height = exImg.height();
            let pxWidth = width * 4;

            this.cfg.width = width;
            this.cfg.height = height;
            this.cfg.pxWidth = pxWidth;
            this.ctx = createCanvas(width, height).getContext('2d');
            this.cfg.wBlockCount = Math.ceil(width / this.cfg.pixelValue);
            this.cfg.hBlockCount = Math.ceil(height / this.cfg.pixelValue);

            this.imgPathList = getFilesByPath(this.cfg.inputPath);

            imgCount = this.imgPathList.length;
            tempData = new Uint8Array(pxWidth * height);
        },
        run() {
            this.init();
            this.imgToByte();
        }
    }
})();



console.time('time');
App.run();


