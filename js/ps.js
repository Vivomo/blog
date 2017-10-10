
const Canvas = (function () {

    var canvas = document.getElementById('canvas'),
        base64Content = document.getElementById('base64Content');

    /**
     * 交换两个坐标像素信息
     * @param arr canvas imageData (一维数组)
     * @param p1 点1的起始index
     * @param p2
     */
    function swipePoint(arr, p1, p2) {
        for (var i = 0; i < 4; i++) {
            var index1 = p1 + i;
            var index2 = p2 + i;
            var temp = arr[index1];
            arr[index1] = arr[index2];
            arr[index2] = temp;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    const commands = {
        drawImgByFile: function (e) {
            this.drawImgOnCanvas(URL.createObjectURL(e.target.files[0]))
        },
        drawImgBySrc: function() {
            this.drawImgOnCanvas(e.target.value)
        },
        drawImgByClipboard: function(e)  {
            // 添加到事件对象中的访问系统剪贴板的接口
            var clipboardData = e.clipboardData,
                items, item, types;

            if( clipboardData ){
                items = clipboardData.items;
                if( !items ){
                    return;
                }
                item = items[0];
                // 保存在剪贴板中的数据类型
                types = clipboardData.types || [];
                for(var i = 0; i < types.length; i++ ){
                    if( types[i] === 'Files' ){
                        item = items[i];
                        break;
                    }
                }
                // 判断是否为图片数据
                if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                    this.imgReader( item );
                }
            }
        },
        toBase64: function() {
            this.base64Content.value = this.canvas.toDataURL('images/png');
        },
        copyBase64: function() {
            this.base64Content.select();
            document.execCommand('copy');
        },
        downloadJPG: function () {
            this.canvas.toBlob((blob) => {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = 'download.jpg';
                a.click();
            }, 'image/jpeg');
        },
        downloadPNG: function () {
            this.canvas.toBlob((blob) => {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = 'download.png';
                a.click();
            }, 'image/png');
        },
        decolourize: function () {
            var imageData = this.getImageData();
            var data = imageData.data;
            for (var i = 0, l = data.length; i < l; i += 4) {
                var avg = (data[i] + data[i+1] + data[i+2]) / 3;
                data[i] = avg;
                data[i+1] = avg;
                data[i+2] = avg;
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        hFlip: function(){
            var imageData = this.getImageData();
            var data = imageData.data;
            var w = this.canvas.width * 4;
            var h = this.canvas.height;
            var loop =  ~~(w / 2);
            for (var i = 0; i < h; i++) {
                for (var j = 0; j < loop; j += 4) {
                    var p1 = i * w + j;
                    var p2 = (i + 1) * w - j - 4;
                    swipePoint(data, p1, p2);
                }
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        vFlip: function(){
            var imageData = this.getImageData();
            var data = imageData.data;
            var w = this.canvas.width * 4;
            var h = this.canvas.height;
            var loop = ~~(h / 2);
            for (var i = 0; i < loop; i++) {
                for (var j = 0; j < w; j += 4) {
                    var p1 = i * w + j;
                    var p2 = (h - 1 - i) * w + j;
                    swipePoint(data, p1, p2);
                }
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        inverse: function(){
            var imageData = this.getImageData();
            var data = imageData.data;
            for (var i = 0, l = data.length; i < l; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            this.pen.putImageData(imageData, 0, 0);
        }
    };

    return {
        canvas,
        commands,
        base64Content,
        pen: canvas.getContext('2d'),
        getImageData: function () {
            return this.pen.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },
        drawImgOnCanvas: function(src) {
            let img = new Image,
                pen = this.pen;
            img.src = src;
            img.onload = function(){
                canvas.width = this.width;
                canvas.height = this.height;
                pen.drawImage(this, 0, 0);
            };
        },
        imgReader: function(item) {
            let blob = item.getAsFile(),
                reader = new FileReader();
            // 读取文件后将其显示在网页中
            reader.onload = (e) => {
                this.drawImgOnCanvas(e.target.result);
            };
            // 读取文件
            reader.readAsDataURL(blob);
        },
        execCommand: function(cmdName) {
            let cmd = this.commands[cmdName];
            if (!cmd) {
                throw `There is no command such as ${cmdName}`;
            }
            cmd.apply(this, Array.from(arguments).splice(1));
        },
        init: function() {
            Array.from(document.querySelectorAll('[data-cmd]')).forEach((elem) => {
                const data = elem.dataset;
                elem.addEventListener(data.event || 'click', (e) => {
                    this.execCommand(data.cmd, e);
                });
            });

        }
    }
})();

Canvas.init();
