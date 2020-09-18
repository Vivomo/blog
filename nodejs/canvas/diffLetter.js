const fs = require('fs');

const {RLE, diff} = require('./utils');


console.time('a');

let pxBtCount = 864;
let frames = fs.readFileSync('D:\\code\\git\\blog\\ignore\\buffer.b');
let frameCount = frames.length / pxBtCount;
let zipFrames = [];
//第一帧 单独处理
let frame = frames.slice(0, pxBtCount);
let [startPx, ...zipFrame] = RLE(frame);

zipFrames.push([(startPx << 7) | 1, zipFrame.length, ...zipFrame]);

let prevFrame = frame;

for (let i = 1; i < frameCount; i++) {
    let frame = frames.slice(i * pxBtCount, (i + 1) * pxBtCount);
    let [startPx, ...zipFrame] = RLE(frame);
    let diffFrame = diff(prevFrame, frame);
    if (diffFrame.length < zipFrame.length) {
        zipFrames.push([2, diffFrame.length, ...diffFrame]);
    } else {
        zipFrames.push([(startPx << 7) | 1, zipFrame.length, ...zipFrame]);
    }
    prevFrame = frame;
}
let flatData= zipFrames.flat(1);
let data = new Int16Array(flatData);
fs.writeFileSync('D:\\code\\git\\blog\\ignore\\bufferDiffRLE.b', Buffer.from(data.buffer));

console.timeEnd('a');

