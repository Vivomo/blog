window.onload = () => {
    let img = document.getElementById('orochi');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let {width, height} = img;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);
    let data = ctx.getImageData(0, 0, width, height).data;
    let indexList = [];
    for (let i = 0, l = data.length; i < l; i += 4) {
        if (data[i] !== 255) {
            indexList.push(i);
        }
    }
    setInterval(() => {
        let imgData = ctx.createImageData(width, height);
        for (let index of indexList) {
            index += (~~(Math.random() * 3) - 1) * 4;
            imgData.data[index + 1] = 128;
            imgData.data[index + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0)
    }, 300);
    setTimeout(() => {
        canvas.style.opacity = '1';
    }, 400);

    let q = document.getElementById('canvas-bg'),
        c = q.getContext('2d'),
        w = q.width = document.body.clientWidth,
        h = q.height = window.innerHeight,
        p = new Array(256).join('1').split('');

    setInterval(function () {
        c.fillStyle = 'rgba(0,0,0,0.05)';
        c.fillRect(0, 0, w, h);
        c.fillStyle = 'rgba(0,125,0,1)';
        p = p.map((v, i) => {
            let r = Math.random();
            c.fillText(String.fromCharCode(Math.floor(2720 + r * 33)), i * 10, v);
            v += 10;
            return v > 768 + r * 1e4 ? 0 : v
        })
    }, 33);
}