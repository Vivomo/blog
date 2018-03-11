class Carousel {
    constructor(opt) {
        this.config = {
            interval: opt.interval || 3000,
            transitionTime: opt.transitionTime || 300,
        };

        this.init(opt);
    }

    init(opt) {
        let wrap = typeof opt.elem === 'string' ? document.querySelector(opt.elem) : opt.elem;
        this.width = wrap.clientWidth;
        this.elem = Array.from(wrap.children).map((elem, index) => ({ elem, index }));
        this.elem[this.elem.length - 1].index = -1;
        this.updatePosition();
        wrap.style.transition = `all ${this.config.transitionTime}ms`;
        wrap.style.webkitTransition = `all ${this.config.transitionTime}ms`;
        this.start();
    }

    /**
     * 更新位置
     */
    updatePosition() {
        this.elem.forEach((item) => {
            item.elem.style.left = item.index * this.width + 'px';
            item.elem.style.zIndex = this.elem.length - Math.abs(item.index);
        })
    }

    /**
     * 更新Index
     */
    updateIndex() {
        this.elem.forEach((item) => {
            item.index = (item.index + this.elem.length) % this.elem.length - 1;
        });
    }

    loop() {
        this.updateIndex();
        this.updatePosition();
    }

    start() {
        this.interval = setInterval(() => {
            this.loop();
        }, this.config.interval);
    }

    stop() {
        clearInterval(this.interval);
    }

}

