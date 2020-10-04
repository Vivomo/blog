let width = 0;
let height = 0;
let pxBtCount = 0;
let frames = 0;
let totalFramesCount = 0;
let interval = 0;

let canvas = document.getElementById('canvas');
let ctx = null;
let stop = false;

JSZipUtils.getBinaryContent('./test.zip', function(err, data) {
    if(err) {
        throw err; // or handle err
    }
    JSZip.loadAsync(data).then(function (zip) {
        return zip.files["test.b"].async('uint8array');
    }).then((data) => {
        width = (data[1] << 8) + data[0];
        height = (data[3] << 8) + data[2];
        frames = data[4];
        interval = ~~(1000 / frames);
        pxBtCount = width * height / 8;

        canvas.width = width * 10;
        canvas.height = height * 10;

        ctx = canvas.getContext('2d');
        ctx.fillStyle = '#00aa00';
        ctx.font = "10px Arial";

        let imgByteData = data.slice(5);
        totalFramesCount = imgByteData.length / pxBtCount;
        window.staticData = imgByteData;
        draw(imgByteData);
    });
});




let restore = (frameData) => {
    let result = [];
    for (let i = 0; i < frameData.length; i++) {
        for (let j = 7; j >= 0; j--) {
            result.push((frameData[i] >> j) & 1);
        }
    }
    return result;
};


let draw = (frames, index = 0) => {
    if (index === totalFramesCount) {
        return;
    }
    let result = restore(frames.slice(index * pxBtCount, (index + 1) * pxBtCount));

    ctx.clearRect(0, 0, width * 10, height * 10);
    for (let i = 1; i <= 72; i++) {
        ctx.fillText(result.slice((i - 1) * width, i * width).join(' '), 0, i * 10);
    }
    setTimeout(() => {
        !stop && draw(frames, index + 1);
    }, interval)
};

let drawStatic = (index) => {
    stop = true;
    draw(staticData, index);
};