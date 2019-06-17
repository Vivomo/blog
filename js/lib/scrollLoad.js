function ScrollLoad(cfg){

    this.cfg = cfg;
    this.difference = cfg.difference || 0; //默认进入可视区执行加载, difference微调控制

    if (cfg.selector) {
        this.elem = document.querySelector(cfg.selector);  //监听元素
        this.checkQueue.push('exeNext')
    }
    if (cfg.prevSelector) {
        this.prevElem = document.querySelector(cfg.prevSelector);
        this.checkQueue.push('exePrev')
    }

}

ScrollLoad.prototype = {
    prevRunning : false,
    nextRunning : false,
    checkQueue : [],

    checkPrev : function () {
        return this.prevElem.getBoundingClientRect().top >= 0;
    },
    prevCallback : function (callback) {
        this.prevRunning = true;
        this.cfg.prevCallback(callback);
    },
    exePrev : function () {
        !this.prevRunning && this.checkPrev() && this.prevCallback();
    },
    nextCallback : function (callback) {
        this.nextRunning = true;
        this.cfg.nextCallback(callback);
    },
    readyPrev : function () {
        this.prevRunning = false;
    },

    checkNext : function () {
        return this.elem.getBoundingClientRect().top <= window.innerHeight;
    },
    exeNext : function () {
        !this.nextRunning && this.checkNext() && this.nextCallback();
    },
    readyNext : function () {
        this.nextRunning = false;
    },
    start : function (command, callback) {
        window.addEventListener('scroll', function () {
            this.checkQueue.forEach(function (item) {
                this[item]();
            }.bind(this))
        });
        if (command === 'prev') {
            this.prevCallback(callback);
        } else if (command === 'next') {
            this.nextCallback(callback);
        }
    }
};


