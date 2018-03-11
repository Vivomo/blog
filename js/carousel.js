class Carousel {
    constructor(opt) {
        this.config = {
            interval: opt.interval || 3000,
        };

        this.init(opt);
    }

    init(opt) {
        let elem = typeof opt.elem === 'string' ? Array.from(document.querySelectorAll(opt.elem)) : opt.elem;
        this.width = elem[0].clientWidth;
        this.elem = elem.map((elem, index) => ({ elem, index }));
        this.elem[this.elem.length - 1].index = -1;
        this.start();
    }

    /**
     * 更新位置
     */
    updatePosition() {
        this.elem.forEach((item) => {
            item.elem.style.left = item.index * this.width + 'px'
            item.elem.style.zIndex = item.index
        })
    }

    /**
     * 更新Index
     */
    updateIndex() {
        this.elem.forEach((item) => {
            item.index = (item.index + 2) % this.elem.length - 1;
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

