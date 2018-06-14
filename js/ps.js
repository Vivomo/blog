
const Canvas = (function () {

    let canvas = document.getElementById('canvas'),
        base64Content = document.getElementById('base64Content'),
        cropWidth = document.getElementById('cropWidth'),
        cropHeight = document.getElementById('cropHeight'),
        weChatNine = document.getElementById('weChatNine');

    let cropper = new Cropper({
        elem: document.querySelector('.canvas-wrap'),
        hide: true,
        minWidth: 1,
        minHeight: 1
    });

    /**
     * 交换两个坐标像素信息
     * @param arr canvas imageData (一维数组)
     * @param p1 点1的起始index
     * @param p2
     */
    function swipePoint(arr, p1, p2) {
        for (let i = 0; i < 4; i++) {
            let index1 = p1 + i;
            let index2 = p2 + i;
            let temp = arr[index1];
            arr[index1] = arr[index2];
            arr[index2] = temp;
        }
    }

    /**
     * 获取创建时间
     * @returns {string}
     */
    function getCreateTime() {
        let date = new Date;
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }


    /**
     * 下载图片
     * @param data
     * @param name
     */
    function downloadImgByImgData(data, name = 'download.png'){
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image;
        img.src = data;
        img.onload = function(){
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            canvas.toBlob((blob) => {
                let a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = name;
                a.click();
            }, 'image/png');
        };
    }


    /**
     *
     * @param options
     */
    function downloadImgByCanvas(options){
        let {canvas, width = canvas.width, height = canvas.height, x = 0, y = 0, type = 'images/png',
            name = `img${width}-${height}.${type.substring(type.lastIndexOf('/')+1)}`} = options;
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCanvas.getContext('2d').putImageData(canvas.getContext('2d').getImageData(x, y, width, height), 0, 0);
        tempCanvas.toBlob((blob) => {
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = name;
            a.click();
        }, type);
    }



    // noinspection JSUnusedGlobalSymbols
    const commands = {
        drawImgByFile: function (e) {
            this.drawImgOnCanvas(URL.createObjectURL(e.target.files[0]))
        },
        drawImgBySrc: function() {
            this.drawImgOnCanvas(document.getElementById('webImg').value)
        },
        drawImgByClipboard: function(e)  {
            // 添加到事件对象中的访问系统剪贴板的接口
            let clipboardData = e.clipboardData,
                items, item, types;

            if( clipboardData ){
                items = clipboardData.items;
                if( !items ){
                    return;
                }
                item = items[0];
                // 保存在剪贴板中的数据类型
                types = clipboardData.types || [];
                for(let i = 0; i < types.length; i++ ){
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
            let options = {
                canvas: this.canvas,
                type: 'image/jpeg'
            };
            if (!this.cropper.hidden) {
                let {width, height, left, top} = this.cropper.getData();
                Object.assign(options, {
                    width,
                    height,
                    x: left,
                    y: top,
                });
            }
            downloadImgByCanvas(options);
        },
        downloadPNG: function () {
            let options = {
                canvas: this.canvas
            };
            if (!this.cropper.hidden) {
                let {width, height, left, top} = this.cropper.getData();
                Object.assign(options, {
                    width,
                    height,
                    x: left,
                    y: top,
                });
            }
            downloadImgByCanvas(options);
        },
        decolourize: function () {
            let imageData = this.getImageData();
            let data = imageData.data;
            for (let i = 0, l = data.length; i < l; i += 4) {
                let avg = (data[i] + data[i+1] + data[i+2]) / 3;
                data[i] = avg;
                data[i+1] = avg;
                data[i+2] = avg;
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        hFlip: function(){
            let imageData = this.getImageData();
            let data = imageData.data;
            let w = this.canvas.width * 4;
            let h = this.canvas.height;
            let loop =  ~~(w / 2);
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < loop; j += 4) {
                    let p1 = i * w + j;
                    let p2 = (i + 1) * w - j - 4;
                    swipePoint(data, p1, p2);
                }
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        vFlip: function(){
            let imageData = this.getImageData();
            let data = imageData.data;
            let w = this.canvas.width * 4;
            let h = this.canvas.height;
            let loop = ~~(h / 2);
            for (let i = 0; i < loop; i++) {
                for (let j = 0; j < w; j += 4) {
                    let p1 = i * w + j;
                    let p2 = (h - 1 - i) * w + j;
                    swipePoint(data, p1, p2);
                }
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        inverse: function(){
            let imageData = this.getImageData();
            let data = imageData.data;
            for (let i = 0, l = data.length; i < l; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            this.pen.putImageData(imageData, 0, 0);
        },
        /**
         * 图片生成9份
         */
        cutNine: function () {
            let {width, height} = this.canvas;
            let sideWidth = ~~(Math.min(width, height) / 3);
            let skewX = 0;
            let skewY = 0;
            if (width > height) {
                skewX = ~~((width - height) / 2)
            } else {
                skewY = ~~((height - width) / 2)
            }
            let tempCanvas = document.createElement('canvas');
            tempCanvas.height = tempCanvas.width = sideWidth;
            let tempCtx = tempCanvas.getContext('2d');
            let imgDataArr = this.wechatImgData = [];
            for (let row = 0; row < 3; row ++) {
                for (let col = 0; col < 3; col ++) {
                    let imgData = this.getImageData(sideWidth * col + skewX, sideWidth * row + skewY,
                        sideWidth * (col + 1) + skewX, sideWidth * (row + 1) + skewY);
                    tempCtx.putImageData(imgData, 0, 0);
                    imgDataArr.push(tempCanvas.toDataURL('images/png'));
                }
            }

            weChatNine.innerHTML = imgDataArr.map((data) => `<li><img src="${data}"/></li>`).join('');
        },
        downloadWechat: function () {
            if (this.wechatImgData.length === 0) {
                return false;
            }
            let createTime = getCreateTime();
            this.wechatImgData.forEach((data, index) => {
                let imgName = `wx${createTime}-${(index + 1)}.png`;
                downloadImgByImgData(data, imgName);
            })
        },
        toggleSelect: function (show = false) {
            this.toggleSelect(show);
        },
        /**
         * 设置选择框大小
         */
        setCropSize: function () {
            let width = ~~ cropWidth.value,
                height = ~~ cropHeight.value;
            this.cropper.setWidth(width);
            this.cropper.setHeight(height, true);
        },
        /**
         * 裁剪
         */
        crop: function () {
            if (this.cropper.hidden) {
                return;
            }
            let {left, top, width, height} = this.cropper.getData();
            let cropImgData = this.getImageData(left, top, width, height);
            this.canvas.width = width;
            this.canvas.height = height;
            this.pen.putImageData(cropImgData, 0, 0);
            this.toggleSelect(false);
        }
    };

    return {
        canvas,
        commands,
        base64Content,
        cropper,
        pen: canvas.getContext('2d'),
        getImageData: function (startX = 0, startY = 0, width = this.canvas.width, height = this.canvas.height) {
            return this.pen.getImageData(startX, startY, width, height);
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
        toggleSelect: function (show = false) {
            if (show === true) {
                this.cropper.show();
            } else if (show === false) {
                this.cropper.hide();
            } else {
                if (this.cropper.hidden) {
                    this.cropper.show();
                } else {
                    this.cropper.hide();
                }
            }

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
