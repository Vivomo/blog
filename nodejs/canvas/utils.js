/**
 * 字节压缩 [0, 1, 0, 0, 1, 1, 1, 1] => [0b01001111]
 * @param arr
 * @returns {[]}
 */
const compress = (arr) => {
    let result = [];
    let temp = 0;
    arr.forEach((item, index) => {
        temp += item << (7 - index % 8);
        if (index % 8 === 7) {
            result.push(temp);
            temp = 0;
        }
    });
    return result;
};

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
                count = 1;
            }
        }
    }

    result.push(count || 1);
    return result;
};

let unzip = (resp) => {
    const isZipFrame = 1;
    let framesData8 = new Uint8Array(resp);
    let framesData = new Int16Array(framesData8.byteLength / 2);
    framesData.forEach((item, index) => {
        let a = framesData8[index * 2];
        let b = framesData8[index * 2 + 1] << 8;
        framesData[index] = a + b;
    });
    let unzipFrames = [];
    let cursor = 0;
    while (cursor < framesData.length) {
        let curFrameData = framesData[cursor];
        if (curFrameData & isZipFrame) {
            let endIndex = cursor + 2 + framesData[cursor + 1];
            let frame = framesData.slice(cursor, endIndex);
            unzipFrames.push(frame);
            cursor = endIndex;
        } else {
            let endIndex = cursor + 1 + pxBtCount / 2;
            let frame = framesData.slice(cursor, endIndex);
            unzipFrames.push(frame);
            cursor = endIndex;
        }
    }
    return unzipFrames;
};

let diff = (prev, cur) => {
    let diffPoint = [];
    for (let i = 0; i < prev.length; i++) {
        for (let j = 7; j >=0; j--) {
            let a = (prev[i] >> j) & 1;
            let b = (cur[i] >> j) & 1;
            if (a !== b) {
                diffPoint.push(i * 8 + 7 -j)
            }
        }
    }
    return diffPoint;
};


module.exports = {
    compress,
    RLE,
    unzip,
    diff
};