const MAP_WIDTH = 11;
let App = {
    wrap: document.getElementById('wrap'),
    colElem: null,
    rowElem: null,
    cat: null,
    catWidth: null,
    catHeight: null,
    ceilWidth: null,
    ceilHeight: null,
    map: null,
    move(x, y) {
        let target = this.rowElem[y].children[x];
        this.cat.style.left = target.offsetLeft - this.catWidth / 2 + this.ceilWidth / 2 + 'px';
        this.cat.style.top = target.offsetTop - this.catHeight + this.ceilHeight / 2 + 'px';
    },
    initHtml() {
        let html = new Array(MAP_WIDTH).fill(0).map(_ => {
            let items = '<div class="point"></div>'.repeat(MAP_WIDTH);
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
    },
    initMap() {
        this.map = new Array(MAP_WIDTH).fill(0).map(_ => {
            return new Array(MAP_WIDTH).fill(0).map(_ => ({active: false}));
        });
        let points = [{x: 5, y: 5}];
        while (points.length < 8) {
            let x = ~~(Math.random() * MAP_WIDTH);
            let y = ~~(Math.random() * MAP_WIDTH);
            let isCreated = points.some(point => point.x === x && point.y === y);
            if (!isCreated) {
                points.push({x, y});
            }
        }
        points.slice(1).forEach((point) => {
            this.activate(point);
        });
    },
    activate({x, y}) {
        let point = this.map[y][x];
        if (point.active) {
            return;
        }
        point.activate = true;
        this.rowElem[y].children[x].classList.add('active');
    },
    init() {
        this.initHtml();
        this.initMap();
        this.move(5, 5);
    }
};

App.init();