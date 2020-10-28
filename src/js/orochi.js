let img = document.getElementById('orochi');
let canvas = document.getElementById('canvas');
let {width, height} = img;
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);
let data = ctx.getImageData(0, 0, width, height).data;
let indexList = [];
for (let i = 0, l = data.length; i < l; i += 4) {
    if (data[i] !== 255) {
        indexList.push(i);
    }
}
setInterval(() => {
    let imgData = ctx.getImageData(0, 0, width, height);
    let data = imgData.data.fill(0);
    for (let index of indexList) {
        let random = Math.random();
        if (random < 0.3) {
            index -= 4;
        } else if (random > 0.7) {
            index += 4;
        }
        data[index + 1] = 128;
        data[index + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0)
}, 300);
