
let App = {
    wrap: document.getElementById('wrap'),
    colElem: null,
    rowElem: null,
    cat: null,
    catWidth: null,
    catHeight: null,
    ceilWidth: null,
    ceilHeight: null,
    move(x, y) {
        let target = this.rowElem[y].children[x];
        this.cat.style.left = target.offsetLeft - this.catWidth / 2 + this.ceilWidth / 2 + 'px';
        this.cat.style.top = target.offsetTop - this.catHeight + this.ceilHeight / 2 + 'px';
    },
    init() {
        let col = 11;
        let row = 11;
        let html = new Array(row).fill(0).map(_ => {
            let items = '<div class="point"></div>'.repeat(col);
            return `<div class="row">${items}</div>`;
        }).join('');
        this.wrap.innerHTML = html + '<div class="cat"></div>';

        this.rowElem = this.wrap.querySelectorAll('.row');
        this.cat = this.wrap.querySelector('.cat');
        this.catWidth = this.cat.offsetWidth;
        this.catHeight = this.cat.offsetHeight;
        let ceil = this.wrap.querySelector('.point');
        this.ceilWidth = ceil.offsetWidth;
        this.catHeight = ceil.offsetHeight;

        this.move(5, 5);
    }
};

App.init();