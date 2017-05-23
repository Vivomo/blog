
const Canvas = (function () {

    var loadFile = document.getElementById('loadFile'),
        canvas = document.getElementById('canvas'),
        loadText = document.getElementById('loadText');
    return {
        loadFile,
        canvas,
        loadText,
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
        init: function () {
            this.loadFile.onchange = function () {
                this.drawImgOnCanvas(URL.createObjectURL(this.loadFile.files[0]))
            }.bind(this)

            this.loadText.onchange = function () {

            }
        }
    }
})();

Canvas.init();
