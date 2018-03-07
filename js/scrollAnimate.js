

let ScrollAnimate = (() => {
    let time = 0;
    return {
        elements: [],
        listen: function () {
            window.addEventListener('scroll', this.checkScroll);
        },
        checkScroll: function () {
            time = setTimeout(function () {
                clearTimeout(time);
            }, 30)
        },
        stop: function () {
            window.removeEventListener('scroll', this.checkScroll);
        },
        init: function (cfg) {
            this.elements = typeof cfg.elements === 'string' ?
                Array.from(document.querySelectorAll(cfg.elements)) : cfg.elements;
            this.listen();
        }
    }
})();

ScrollAnimate.init({
    elements: ''
});