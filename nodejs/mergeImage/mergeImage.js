const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const gm = require('gm');

let root = '../../ignore/step';
let outputPath = path.join(__dirname, '../../ignore/stepMerge');
let dirs = fs.readdirSync(root);

dirs.forEach((dirName) => {
    let outputImgPath = path.join(outputPath, `${dirName}.png`);

    if(fs.existsSync(outputImgPath)) {
        console.warn(outputImgPath, 'exist')
        return;
    }

    let imgDir = path.join(root, dirName);
    let totalHeight = 0;

    let imgListPath = fs.readdirSync(imgDir).map(imgName => path.join(__dirname, imgDir, imgName));
    imgListPath.sort((a, b) =>
        ~~a.match(/\d+(?=.jpg)/)[0] - ~~b.match(/\d+(?=.jpg)/)[0]);

    let imgListSize = imgListPath.map(imgPath => {
        let { width, height } = sizeOf(imgPath);
        totalHeight += height;
        return {
            width,
            height,
            y: totalHeight - height
        }
    });

    let _gm = imgListPath.reduce((prevGm, imgPath, index) => {
        return prevGm.in('-page', `+0+${imgListSize[index].y}`).in(imgPath)
    }, gm());

    _gm.mosaic().write(outputImgPath, (err) => {
        if (err) {
            console.error(outputImgPath, 'error')
        } else {
            console.log(outputImgPath, 'done');
        }
    })

});
