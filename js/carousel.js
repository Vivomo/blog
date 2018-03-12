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
        this.wrap = wrap;
        this.moving = false;
        this.afterSwitch = opt.afterSwitch || (() => {});
        this.width = wrap.clientWidth;
        this.elem = Array.from(wrap.children);
        this.activeIndex = 0;
        this.prevActiveIndex = this.elem.length - 1;
        this.updatePosition();
        this.start();
    }

    /**
     * 更新位置
     */
    updatePosition(isNext = true) {
        this.wrap.style.webkitTransition = this.wrap.style.transition = 'none';
        let showArr = [this.prevActiveIndex, this.activeIndex];
        this.elem.filter((item, index) => !showArr.includes(index)).forEach((item) => {
            item.style.visibility = 'hidden';
        });
        let nextElem = this.elem[this.activeIndex];
        nextElem.style.visibility = 'visible';
        this.elem[this.prevActiveIndex].style.left = this.wrap.style.left = '0px';
        if (isNext) {
            nextElem.style.left = this.width + 'px';
        } else {
            nextElem.style.left = -this.width + 'px';
        }
        setTimeout(() => {
            this.move(isNext);
        }, 0);
    }

    move(isNext = true) {
        this.moving = true;
        this.wrap.style.webkitTransition = this.wrap.style.transition = `all ${this.config.transitionTime}ms`;
        if (isNext) {
            this.wrap.style.left = -this.width + 'px';
        } else {
            this.wrap.style.left = this.width + 'px';
        }

        setTimeout(() => {
            this.moving = false;
            this.afterSwitch(this.activeIndex, this.prevActiveIndex);
        }, this.config.transitionTime);
    }

    /**
     * 更新Index
     */
    updateIndex(activeIndex) {
        this.prevActiveIndex = this.activeIndex;
        this.activeIndex = activeIndex;
    }

    next(target = this.activeIndex + 1) {
        this.updateIndex(target % this.elem.length);
        this.updatePosition();
    }

    prev(target = this.activeIndex - 1) {
        this.updateIndex((target + this.elem.length) % this.elem.length);
        this.updatePosition(false);
    }

    targetTo(index) {
        if (this.activeIndex > index) {
            this.prev(index);
        } else if (this.activeIndex < index){
            this.next(index);
        }
    }

    loop() {
        this.next();
    }

    stop() {
        clearInterval(this.interval);
    }

    start() {
        this.interval = setInterval(() => {
            this.loop();
        }, this.config.interval);
    }
}

