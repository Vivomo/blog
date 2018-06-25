class Carousel {
    constructor(opt) {
        this.config = {
            interval: 3000,
            transitionTime: 300,
            looped: true,
            auto: true,
            touchable: false,
            margin: 0,
            width: 0,
            listener: null
        };

        for (let key in this.config) {
            if (key in opt) {
                this.config[key] = opt[key];
            }
        }

        this.init(opt);
    }

    init(opt) {
        this.transitionStyleName = 'transition' in document.body.style ? 'transition' : 'webkitTransition';
        this.transformStyleName = 'transform' in document.body.style ? 'transform' : 'webkitTransform';

        let wrap = typeof opt.elem === 'string' ? document.querySelector(opt.elem) : opt.elem;
        this.listener = opt.listener ? (typeof opt.listener === 'string' ? document.querySelector(opt.listener) : opt.listener) : null;
        this.wrap = wrap;
        this.moving = false;
        this.afterSwitch = opt.afterSwitch || (() => {});
        this.width = this.config.width || wrap.clientWidth;
        this.elem = Array.from(wrap.children);
        this.activeIndex = 0;
        this.translateX = 0;
        this.prevActiveIndex = this.elem.length - 1;
        if (this.config.touchable) {
            this.listenTouch();
        }
        if (this.config.auto) {
            this.updatePosition();
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
        this.toggleTransition(false);
        if (this.config.looped) {
            let showArr = [this.prevActiveIndex, this.activeIndex];
            this.elem.filter((item, index) => !showArr.includes(index)).forEach((item) => {
                item.style.visibility = 'hidden';
            });
            let nextElem = this.elem[this.activeIndex];
            nextElem.style.visibility = 'visible';
            this.elem[this.prevActiveIndex].style.left = '0px';
            this.wrap.style[this.transformStyleName] = 'translate3d(0, 0, 0)';
            if (isNext) {
                nextElem.style.left = this.width + 'px';
            } else {
                nextElem.style.left = -this.width + 'px';
            }
        }
        setTimeout(() => {
            this.move(isNext);
        }, 16);
    }

    move(isNext = true) {
        this.moving = true;
        this.toggleTransition(true);
        if (this.config.looped) {
            this.translateX = isNext ? - (this.width + this.config.margin) : this.width + this.config.margin;
        } else {
            this.translateX = (this.width + this.config.margin) * -this.activeIndex;
        }
        this.wrap.style[this.transformStyleName] = `translate3d(${this.translateX}px, 0, 0)`;

        setTimeout(() => {
            this.moving = false;
            this.afterSwitch(this.activeIndex, this.prevActiveIndex);
        }, this.config.transitionTime);
    }

    /**
     * 归位复原
     */
    restore() {
        this.toggleTransition(true);
        setTimeout(() => {
            this.wrap.style[this.transformStyleName] = `translate3d(${this.translateX}px, 0, 0)`;
        }, 16);
    }

    toggleTransition(isAdd) {
        if (isAdd === false) {
            this.wrap.style[this.transitionStyleName] = 'none';
        } else {
            if (isAdd || this.wrap.style[this.transitionStyleName] === '' ||
                this.wrap.style[this.transitionStyleName] === 'none') {
                this.wrap.style[this.transitionStyleName] = this.getTransition();
            } else {
                this.wrap.style[this.transitionStyleName] = 'none';
            }
        }
    }

    /**
     * 获取transition值, 如果轮播是touchable触发则判定为wap场景, 用默认的贝塞尔曲线
     * @returns {string}
     */
    getTransition() {
        return `all ${this.config.transitionTime}ms ${this.config.touchable ? '' : 'cubic-bezier(0.94,-0.01, 0.11, 0.97)'}`;
    }

    /**
     * 监听touch 事件
     */
    listenTouch() {
        let startX = 0;
        let startY = 0;
        let movedX = 0;
        let movedY = 0;
        let monitorDistance = 30; // 监测的移动距离用来判断意图方向
        let direction = null;
        let xDirection = 'x';
        let yDirection = 'y';
        let listener = this.listener || this.wrap
        let touchMove = (e) => {
            let point = e.touches[0];
            movedX = point.pageX - startX;
            movedY = point.pageY - startY;
            if (direction === null) {
                if (Math.abs(movedX) > monitorDistance) {
                    direction = xDirection;
                } else if (Math.abs(movedY) > monitorDistance) {
                    direction = yDirection
                }
                // e.preventDefault();
                e.stopPropagation();
            } else {
                if (direction === xDirection) {
                    this.wrap.style[this.transformStyleName] = `translate3d(${this.translateX + movedX - monitorDistance}px, 0, 0)`;
                    e.preventDefault();
                    e.stopPropagation();
                } else {

                }
            }
        };
        listener.addEventListener('touchstart', (e) => {
            if (this.moving) {
                return;
            }
            direction = null;
            this.toggleTransition(false);
            let point = e.touches[0];
            startX = point.pageX;
            startY = point.pageY;

            listener.addEventListener('touchmove', touchMove);
        });

        listener.addEventListener('touchend', () => {
            if (Math.abs(movedX) > this.width / 4) {
                if (movedX < 0) {
                    if (this.activeIndex === this.elem.length - 1) {
                        this.restore()
                    } else {
                        this.next();
                    }
                } else {
                    if (this.activeIndex === 0) {
                        this.restore();
                    } else {
                        this.prev();
                    }
                }
            } else {
                this.restore()
            }
            this.wrap.removeEventListener('touchmove', touchMove);
        });


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

