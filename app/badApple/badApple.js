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
            unzipFrames.push(framesData.slice(cursor + 1, cursor + 1 + pxBtCount));
            cursor += 1 + pxBtCount;
        }
    }
    return unzipFrames;
};

let unzipFrame = (startPx, countData) => {
    let curPx = startPx;
    return countData.map((count) => {
         let data = new Int8Array(count);
         if (curPx) {
             data.fill(curPx);
             curPx = 0;
         } else {
             curPx = 1;
         }
    }).flat(1);
};