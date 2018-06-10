
let Cutter = function (options) {
    this.options = options;
    this.init()
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
    init: function () {
        this.initStyle();
        this.initListener();
    },
    initListener: function () {
        this.listenCropper();
    },
    listenCropper: function () {
        let startX = 0;
        let startY = 0;
        this.cropper.addEventListener('click', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            console.log(e);
        });
    },
    initStyle: function () {
        this.initWrap();
        this.initCropperStyle();
    },
    initWrap: function () {
        this.elem = this.options.elem;
        this.width = this.elem.clientWidth;
        this.height = this.elem.clientHeight;
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
        this.updateCropperPosition();
    },
    updateCropperPosition: function () {
        this.cropper.style.cssText = `
            left: ${this.left}px;
            right: ${this.right}px;
            top: ${this.top}px;
            bottom: ${this.bottom}px;
            `;
    },
    move: function (x, y) {
        this.left -= x;
        this.right += x;
        this.top -= y;
        this.bottom += y;
        this.updateCropperPosition();
    },

};