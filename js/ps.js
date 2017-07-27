
var Canvas = (function () {

    var loadFile = document.getElementById('loadFile'),
        canvas = document.getElementById('canvas'),
        webImg = document.getElementById('webImg'),
        pasteImg = document.getElementById('pasteImg'),
        toBase64 = document.getElementById('toBase64'),
        base64Content = document.getElementById('base64Content'),
        copyBase64 = document.getElementById('copyBase64'),
        loadWebImg = document.getElementById('loadWebImg');
    return {
        loadFile,
        canvas,
        pen: canvas.getContext('2d'),
        drawImgOnCanvas: function(src){
            let img = new Image,
                pen = this.pen;
            img.src = src;
            img.onload = function(){
                canvas.width = this.width;
                canvas.height = this.height;
                pen.drawImage(this, 0, 0);
            };
        },
        imgReader: function( item ){
            var blob = item.getAsFile(),
                reader = new FileReader();
            // 读取文件后将其显示在网页中
            reader.onload = (e) => {
                this.drawImgOnCanvas(e.target.result);
            };
            // 读取文件
            reader.readAsDataURL( blob );
        },
        init: function () {
            this.loadFile.onchange = () => {
                this.drawImgOnCanvas(URL.createObjectURL(this.loadFile.files[0]))
            };

            loadWebImg.addEventListener('click', () => {
                this.drawImgOnCanvas(webImg.value)
            });

            pasteImg.addEventListener('paste', (e) => {
                // 添加到事件对象中的访问系统剪贴板的接口
                var clipboardData = e.clipboardData,
                    items, item, types;

                if( clipboardData ){
                    console.log(clipboardData);
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
            });

            toBase64.addEventListener('click', () => {
                base64Content.value = canvas.toDataURL('images/png');
            });

            copyBase64.addEventListener('click', function () {
                base64Content.select();
                if (!document.execCommand('copy'))
                    alert('你的垃圾浏览器不支持复制');
            }, false);
        }
    }
})();

Canvas.init();
