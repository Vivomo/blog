
let Cutter = function (options) {
    this.init(options)
};

Cutter.prototype = {
    constructor: Cutter,
    defaultConfig: {

    },
    cropperTemplate: `
        <div class="cutter">
            <div class="square s-lt"></div>
            <div class="square s-t"></div>
            <div class="square s-rt"></div>
            <div class="square s-l"></div>
            <div class="square s-r"></div>
            <div class="square s-lb"></div>
            <div class="square s-rb"></div>
            <div class="square s-b"></div>
        </div>
    `,
    init: function (options) {
        this.elem = options.elem;
        this.width = this.elem.clientWidth;
        this.height = this.elem.clientHeight;
        this.initWrap();
        this.initCropperStyle();
    },
    initWrap: function () {
        let wrap = document.createElement('div');
        wrap.className = 'cropper-wrap';
        wrap.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; position: absolute';
        wrap.innerHTML = this.cropperTemplate;
        this.cropper = wrap.querySelector('.cutter');
        this.elem.appendChild(wrap);
    },
    initCropperStyle: function () {
        let width = Math.min(this.width, this.height) / 4;
        this.right = this.left = ~~((this.width - width) / 2);
        this.top = this.bottom = ~~((this.height - width) / 2);
        this.cropper.style.cssText = `position: absolute; 
            left: ${this.left}px;
            right: ${this.right}px;
            top: ${this.top}px;
            bottom: ${this.bottom}px;`
    }
};