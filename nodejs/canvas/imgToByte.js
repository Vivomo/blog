const {createCanvas, loadImage} = require('canvas');
const fs = require('fs');
const images = require('images');
const {getFilesByPath} = require('../util/fileUtil');
const {compress} = require('./utils');


let cfgContent = fs.readFileSync('D:\\code\\git\\blog\\ignore\\imgByte\\test.json', 'utf-8');
let cfg = JSON.parse(cfgContent);

// ffmpeg -i src01.avi %d.jpg

let App = (() => {

    let imgCount = 0;
    let tempData;
    let byteList = [];
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
                byteList[imgIndex] = compress(letterArea);
                imgCount--;
                console.log(imgCount);
                if (imgCount > 0) {
                    this.imgToByte();
                } else {
                    this.save();
                    console.timeEnd('time');
                }
            });
        },
        /**
         * 返回信息头
         * 5个字节 表示 宽2 高2 帧数1
         */
        getHeadData() {
            let b = new Uint8Array(5);
            let w = this.cfg.width / this.cfg.pixelValue;
            let h = this.cfg.height / this.cfg.pixelValue;
            let wh = new Uint8Array(Int16Array.from([w, h]).buffer);
            wh.forEach((item, index) => {
                b[index] = wh[index];
            });
            b[4] = this.cfg.frames;
            return b;
        },
        save() {
            let imgByte = Uint8Array.from(byteList.flat(1));
            let headData = this.getHeadData();
            let result = new Uint8Array(imgByte.length + headData.length);
            result.set(headData);
            result.set(imgByte, headData.length);
            fs.writeFileSync(`${this.cfg.outputPath}\\${this.cfg.name}.b`, Buffer.from(result));
        },
        init() {
            Object.assign(this.cfg, cfg);

            let exImg = images(`${this.cfg.inputPath}\\1.jpg`);
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


