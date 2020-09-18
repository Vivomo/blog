JSZipUtils.getBinaryContent('buffer.zip', function(err, data) {
    if(err) {
        throw err; // or handle err
    }
    JSZip.loadAsync(data).then(function (zip) {
        return zip.files["buffer.b"].async('uint8array');
    }).then((data) => {
        draw(data);
    });
});

const pxBtCount = 864;


let restore = (frameData) => {
    let result = [];
    for (let i = 0; i < frameData.length; i++) {
        for (let j = 7; j >= 0; j--) {
            result.push((frameData[i] >> j) & 1);
        }
    }
    return result;
};

let apple = document.getElementById('apple');
let ctx = apple.getContext('2d');

ctx.fillStyle = '#00aa00';
ctx.font = "10px Arial";


let draw = (frames, index = 0) => {
    if (index === frames.length) {
        return;
    }
    let result = restore(frames.slice(index * pxBtCount, (index + 1) * pxBtCount));

    ctx.clearRect(0, 0, 960, 720);
    for (let i = 1; i <= 72; i++) {
        ctx.fillText(result.slice((i - 1) * 96, i * 96).join(' '), 0, i * 10);
    }
    setTimeout(() => {
        draw(frames, index + 1);
    }, 33)
};