
let Cropper = function (options) {
    this.options = Object.assign({}, this.defaultConfig, options);
    this.init()
};

Cropper.prototype = {
    constructor: Cropper,
    defaultConfig: {
        minWidth: 5,
        minHeight: 5
    },
    cropperTemplate: `
        <div class="cutter">
            <div class="square s-lt" data-left="1" data-top="1"></div>
            <div class="square s-t" data-top="1"></div>
            <div class="square s-rt" data-width="1" data-top="1"></div>
            <div class="square s-l" data-left="1"></div>
            <div class="square s-r" data-width="1"></div>
            <div class="square s-lb" data-left="1" data-height="1"></div>
            <div class="square s-rb" data-width="1" data-height="1"></div>
            <div class="square s-b" data-height="1"></div>
        </div>
    `,
    init: function () {
        this.initStyle();
        this.initListener();
    },
    initListener: function () {
        this.listenCropper();
        this.listenCropperItem();
    },
    listenCropper: function () {
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        this.cropper.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            startLeft = this.left;
            startTop = this.top;

            document.body.addEventListener('mousemove', cropMove);
            document.body.addEventListener('mouseup', () => {
                document.body.removeEventListener('mousemove', cropMove)
            });
        });

        let cropMove = (e) => {
            let x = e.clientX;
            let y = e.clientY;
            this.move(startX - x, startY - y);
            startX = x;
            startY = y;
        };
    },
    listenCropperItem: function () {
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        Array.from(this.cropper.querySelectorAll('.square')).forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startX = e.clientX;
                startY = e.clientY;
                startLeft = this.left;
                startTop = this.top;

                let temp = (e) => {
                    cropUpdate(e, item.dataset)
                };

                document.body.addEventListener('mousemove', temp);
                document.body.addEventListener('mouseup', () => {
                    document.body.removeEventListener('mousemove', temp)
                });
            });
        });

        let cropUpdate = (e, data) => {
            let x = e.clientX;
            let y = e.clientY;
            let offsetX = x - startX;
            let offsetY = y - startY;
            if (data.left) {
                this.setLeft(this.left + offsetX);
            }
            if (data.top) {
                this.setTop(this.top + offsetY);
            }

            if (data.width) {
                this.setWidth(this.width + offsetX)
            }

            if (data.height) {
                this.setHeight(this.height + offsetY)
            }
            this.updateCropperPosition()
            startX = x;
            startY = y;
        };
    },
    initStyle: function () {
        this.initWrap();
        this.initCropperStyle();
    },
    initWrap: function () {
        this.elem = this.options.elem;
        this.wrapWidth = this.elem.clientWidth;
        this.wrapHeight = this.elem.clientHeight;
        let wrap = document.createElement('div');
        wrap.className = 'cropper-wrap';
        wrap.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; position: absolute';
        wrap.innerHTML = this.cropperTemplate;
        this.cropper = wrap.querySelector('.cutter');
        this.elem.appendChild(wrap);
    },
    initCropperStyle: function () {
        let width = Math.min(this.wrapWidth, this.wrapHeight) / 4;
        
        this.left = ~~((this.wrapWidth - width) / 2);
        this.top = ~~((this.wrapHeight - width) / 2);
        this.width = this.height = width;
        this.updateCropperPosition();
    },
    updateCropperPosition: function () {
        this.cropper.style.cssText = `
            left: ${this.left}px;
            width: ${this.width}px;
            top: ${this.top}px;
            height: ${this.height}px;
            `;
    },
    move: function (x, y) {
        this.setLeft(this.left - x, false);
        this.setTop(this.top - y, false);
        this.updateCropperPosition();
    },

    setLeft: function (left, fixed = true, update = false) {
        let max = fixed ? (this.left + this.width - this.options.minWidth) : (this.wrapWidth - this.width);
        let prevLeft = this.left;
        this.left = Math.max(Math.min(max, left), 0);
        if (fixed) {
            this.setWidth(this.width + (prevLeft - this.left))
        }

        if (update) {
            this.updateCropperPosition()
        }
    },

    setTop: function (top, fixed = true, update = false) {
        let max = fixed ? (this.top + this.height - this.options.minHeight) : (this.wrapHeight - this.height);
        let prevTop = this.top;
        this.top = Math.max(Math.min(max, top), 0);
        if (fixed) {
            this.setHeight(this.height + (prevTop - this.top));
        }
        if (update) {
            this.updateCropperPosition()
        }
    },

    setWidth: function (width, update = false) {
        this.width = Math.max(this.options.minWidth, Math.min(width, this.wrapWidth - this.left));
        if (update) {
            this.updateCropperPosition()
        }
    },

    setHeight: function (height, update = false) {
        this.height = Math.max(1, Math.min(height, this.wrapHeight - this.top));
        if (update) {
            this.updateCropperPosition()
        }
    },



};