const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        unzip(xhr.response);
    }
};
xhr.responseType = 'arraybuffer';
xhr.open('GET', 'bufferRLE.b', true);
xhr.send(null);

const isZipFrame = 1;
const pxBtCount = 864;

let unzip = (resp) => {
    let framesData = new Int16Array(resp);
    let unzipFrames = [];
    let cursor = 0;
    while (cursor < framesData.length) {
        let curFrameData = framesData[cursor];
        if (curFrameData & isZipFrame) {
            let startPx = (curFrameData >> 7) & 1;
            let endIndex = cursor + 2 + framesData[cursor + 1];
            let countData = framesData.slice(cursor + 2, endIndex);
            let frame = unzipFrame(startPx, countData);
            unzipFrames.push(frame);
            cursor += endIndex;
        } else {
            let endIndex = cursor + 1 + pxBtCount;
            let frame = restore(framesData.slice(cursor + 1, endIndex));
            unzipFrames.push(frame);
            cursor += endIndex;
        }
    }
    return unzipFrames;
};

let unzipFrame = (startPx, countData) => {
    let curPx = startPx;
    return Array.from(countData).map((count) => {
         let data = new Array(count).fill(curPx);
         curPx = curPx ? 0 : 1;
         return data;
    }).flat(1);
};

let restore = (frameData) => {
    let result = [];
    for (let i = 0; i < frameData.length; i++) {
        for (let j = 7; j >= 0; j--) {
            result.push((frameData >> j) & 1);
        }
    }
    return result;
};