
var Canvas = (function () {

    var loadFile = document.getElementById('loadFile'),
        canvas = document.getElementById('canvas'),
        webImg = document.getElementById('webImg'),
        pasteImg = document.getElementById('pasteImg'),
        toBase64 = document.getElementById('toBase64'),
        base64Content = document.getElementById('base64Content'),
        copyBase64 = document.getElementById('copyBase64'),
        loadWebImg = document.getElementById('loadWebImg');

    const commands = {
        drawImgBySrc: function() {
            this.drawImgOnCanvas(webImg.value)
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
        }
    };

    return {
        loadFile,
        canvas,
        commands,
        base64Content,
        pen: canvas.getContext('2d'),
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
            reader.readAsDataURL( blob );
        },
        execCommand: function(cmdName) {
            let cmd = this.commands[cmdName];
            if (!cmd) {
                throw `There is no command such as ${cmdName}`;
            }
            cmd.apply(this, Array.from(arguments).splice(1));
        },
        init: function() {
            this.loadFile.onchange = () => {
                this.drawImgOnCanvas(URL.createObjectURL(this.loadFile.files[0]))
            };

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
