chrome.tabs.query({
    active: true
}, function (tabs) {
    let tab = tabs[0];
    let canvas = null;
    let wrap = document.getElementById('qr-code');

    createQRCode(tab.url);

    document.getElementById('download').addEventListener('click', function () {
        let canvas = wrap.querySelector('canvas');
        canvas.toBlob((blob) => {
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'qrcode' + +new Date + '.png';
            a.click();
        }, 'image/png');
    });

    document.getElementById('urlInput').addEventListener('keydown', function (e) {
        if (e.keyCode === 13 && this.value.trim() !== '') {
            createQRCode(this.value.trim());
        }
    });

    function createQRCode(text) {
        let width = 200,
            height = 200,
            background = "#ffffff",
            foreground = "#000000";

        let qrcode	= new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(text);
        qrcode.make();
        let moduleCount = qrcode.getModuleCount();

        // create canvas element
        if (!canvas) {
            canvas	= document.createElement('canvas');
            wrap.appendChild(canvas);

        }
        canvas.width = width;
        canvas.height = height;
        let ctx	= canvas.getContext('2d');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        // compute tileW/tileH based on options.width/options.height
        let tileW = width  / moduleCount;
        let tileH = height / moduleCount;

        ctx.fillStyle = foreground;
        for( let row = 0; row < moduleCount; row++ ){
            for(let col = 0; col < moduleCount; col++ ){
                if (!qrcode.isDark(row, col)) {
                    continue;
                }
                let w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
                let h = Math.ceil((row+1)*tileW) - Math.floor(row*tileW);
                ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);
            }
        }
    }

});
