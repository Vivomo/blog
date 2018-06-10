
let Cutter = function () {

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
    },
    initWrap: function () {
        let wrap = document.createElement('div');
        wrap.className = 'cropper-wrap';
        wrap.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; position: absolute';
        wrap.innerHTML = this.cropperTemplate;
        this.elem.appendChild(wrap)
    }
};