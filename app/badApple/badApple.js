const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let frames = unzip(xhr.response);
        draw(frames);
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
            // let startPx = (curFrameData >> 7) & 1;
            let endIndex = cursor + 2 + framesData[cursor + 1];
            let frame = framesData.slice(cursor, endIndex);
            unzipFrames.push(frame);
            cursor = endIndex;
        } else {
            let endIndex = cursor + 1 + pxBtCount / 2;
            let frame = framesData.slice(cursor + 1, endIndex);
            unzipFrames.push(frame);
            cursor = endIndex;
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


let apple = document.getElementById('apple');
let ctx = apple.getContext('2d');

// ctx.beginPath();
ctx.fillStyle = '#00aa00';
ctx.font = "10px Microsoft Yahei"
// ctx.stroke();

let draw = (frames, index = 0) => {
    if (index === frames.length) {
        return;
    }
    let frame = frames[index];
    let data = frame[0];
    let result;
    if (data & isZipFrame) {
        let start = (data >> 7) & 1;
        result = unzipFrame(start, frame.slice(2));
    } else {
        result = restore(frame.slice(1));
    }
    ctx.clearRect(0, 0, 960, 720);
    for (let i = 1; i <= 72; i++) {
        ctx.fillText(result.slice((i - 1) * 96, i * 96).join(' '), 0, i * 10);
    }
    setTimeout(() => {
        draw(frames, index + 1);
    }, 33)
};