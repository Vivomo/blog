const fs = require('fs');

/**
 *
 * @param arr 原帧
 * @returns
 */
let RLE = (arr) => {
    let current = arr[0] >> 7;
    let result = [current];
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 7; j >= 0; j--) {
            if (((arr[i] >> j) & 1) === current) {
                count++;
            } else {
                result.push(count);
                current = current ? 0 : 1;
                count = 0;
            }
        }
    }

    result.push(count || 1);
    return result;
};


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