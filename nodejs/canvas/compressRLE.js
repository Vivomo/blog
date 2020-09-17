const fs = require('fs');
const {RLE} = require('./utils');


console.time('a');

let pxBtCount = 864;
let frames = fs.readFileSync('D:\\code\\git\\blog\\ignore\\buffer.b');
let frameCount = frames.length / pxBtCount;
let zipFrames = [];

for (let i = 0; i < frameCount; i++) {
    let frame = frames.slice(i * pxBtCount, (i + 1) * pxBtCount);
    let [startPx, ...zipFrame] = RLE(frame);
    if (zipFrame.length * 2 > pxBtCount) {
        zipFrames.push([0, ...frame]);
    } else {
        zipFrames.push([(startPx << 7) | 1, zipFrame.length, zipFrame]);
    }
}

fs.writeFileSync('D:\\code\\git\\blog\\ignore\\bufferRLE.b', Buffer.from(new Int16Array(zipFrames.flat(1)).buffer));

console.timeEnd('a');