
const Canvas = (function () {

    var canvas = document.getElementById('canvas'),
        base64Content = document.getElementById('base64Content');

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
            var a = document.createElement('a');
            a.href = this.canvas.toDataURL("image/jpeg");
            a.download = 'v.jpg';
            a.click();
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
            console.log(imageData);
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
