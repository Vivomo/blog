class ShootTest{

    constructor(config) {
        this.screen = config.screen;
        this.width = this.screen.clientWidth;
        this.height = this.screen.clientHeight;
        this.diameter = config.diameter || 60;
        this.perLVHitCount = config.perLVHitCount || 20;
        this.initScreen();
        this.initData();
    }

    set targetCount(value) {
        this._target = value;
        this.targetCountElem.innerHTML = value;
    }

    get targetCount() {
        return this._target || 0;
    }

    set missCount(value) {
        this._missCount = value;
        this.missCountElem.innerHTML = value;
    }

    get missCount() {
        return this._missCount || 0;
    }

    set hitCount(value) {
        this._hit = value;
        this.hitCountElem.innerHTML = value;
        if (this.hitCount / this.perLVHitCount >= this.lv) {
            this.upgrade();
        }
    }

    get hitCount() {
        return this._hit || 0;
    }

    set lv(value) {
        this._lv = value;
        this.lvElem.innerHTML = value;
    }

    get lv() {
        return this._lv || 0;
    }

    initScreen() {
        this.targetCountElem = this.screen.querySelector('.target-count');
        this.missCountElem = this.screen.querySelector('.miss');
        this.hitCountElem = this.screen.querySelector('.hit');
        this.lvElem = this.screen.querySelector('.lv');

        this.screen.addEventListener('click', ({target}) => {
            if (target.classList.contains('target')) {
                target.remove();
                this.targetCount -= 1;
                this.hitCount += 1;
            }
        });
    }

    initData() {
        this.targetCount = 0;
        this.missCount = 0;
        this.hitCount = 0;
        this.lv = 1;
    }

    /**
     * 升级
     */
    upgrade() {
        this.lv += 1;
        clearInterval(this.interval);
        this.autoCreate();
    }

    createTarget() {
        let target = document.createElement('div');
        target.style.left = `${~~ ((this.width - this.diameter)  * Math.random())}px`;
        target.style.top = `${~~ ((this.height - this.diameter)  * Math.random())}px`;
        target.style.width = target.style.height = `${this.diameter}px`;
        this.screen.appendChild(target);
        target.className = 'target';
        this.targetCount += 1;

        setTimeout(() => {
            target.classList.add('hide');
            setTimeout(() => {
                if (this.screen.contains(target)) {
                    this.missCount += 1;
                    target.remove()
                }
            }, 1000)
        }, 3500);
    }

    autoCreate() {
        this.interval = setInterval(() => {
            this.createTarget();
        }, (13 - this.lv * 4) * 100)
    }
}