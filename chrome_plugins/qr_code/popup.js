chrome.tabs.query({
    active: true
}, function (tabs) {
    var tab = tabs[0],
        width = 200,
        height = 200,
        background = "#ffffff",
        foreground = "#000000";

    var qrcode	= new QRCode(-1, QRErrorCorrectLevel.H);
    qrcode.addData(tab.url);
    qrcode.make();

    // create canvas element
    var canvas	= document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx	= canvas.getContext('2d');

    // compute tileW/tileH based on options.width/options.height
    var tileW	= width  / qrcode.getModuleCount();
    var tileH	= height / qrcode.getModuleCount();

    // draw in the canvas
    for( var row = 0; row < qrcode.getModuleCount(); row++ ){
        for( var col = 0; col < qrcode.getModuleCount(); col++ ){
            ctx.fillStyle = qrcode.isDark(row, col) ? foreground : background;
            var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
            var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
            ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);
        }
    }

    var wrap = document.getElementById('qr-code');
    wrap.appendChild(canvas);

    document.getElementById('download').addEventListener('click', function () {
        var canvas = wrap.querySelector('canvas');
        canvas.toBlob((blob) => {
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'qrcode' + +new Date + '.png';
            a.click();
        }, 'image/png');
    });

});
