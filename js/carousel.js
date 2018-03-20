class Carousel {
    constructor(opt) {
        this.config = {
            interval: 3000,
            transitionTime: 300,
            looped: true,
            auto: true,
            touchable: false
        };

        for (let key of this.config) {
            if (key in opt) {
                this.config[key] = opt[key];
            }
        }

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
        if (this.config.auto) {
            this.start();

            wrap.addEventListener('mouseenter', () => {
                this.stop();
            });

            wrap.addEventListener('mouseleave', () => {
                this.start();
            })
        }
    }

    /**
     * 更新位置
     */
    updatePosition(isNext = true) {
        if (!this.config.looped) {
            return false;
        }
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
        }, 16);
    }

    move(isNext = true) {
        this.moving = true;
        this.wrap.style.webkitTransition = this.wrap.style.transition = `all ${this.config.transitionTime}ms cubic-bezier(0.94,-0.01, 0.11, 0.97)`;
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
     * 监听touch 事件
     */
    listenTouch() {
        let startX = 0;
        let startY = 0;
        let movedX = 0;
        this.wrap.addEventListener('touchstart', (e) => {
            let point = e.touches[0];
            startX = point.pageX;
            startY = point.pageY;

            this.wrap.addEventListener('touchmove', touchMove);
        });

        this.wrap.addEventListener('touchend', () => {
             this.wrap.removeEventListener('touchmove', touchMove);
        });

        function touchMove(e) {
            let point = e.touches[0];
            movedX = point.pageX - startX;
        }
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
            this.stop();
        } else if (this.activeIndex < index){
            this.next(index);
            this.stop();
        }
        setTimeout(() => {
            this.start();
        }, 0)
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

