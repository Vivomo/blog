window.onload = () => {
    let img = document.getElementById('orochi');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let indexList = [];
    for (let i = 0, l = data.length; i < l; i += 4) {
        if (data[i] !== 255) {
            indexList.push(i);
        }
    }
    setInterval(() => {
        let imgData = ctx.createImageData(canvas.width, canvas.height);
        for (let index of indexList) {
            index += (~~(Math.random() * 3) - 1) * 4;
            imgData.data[index + 1] = 128;
            imgData.data[index + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0)
    }, 300);
}