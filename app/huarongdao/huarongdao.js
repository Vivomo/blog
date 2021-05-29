const LevelMap = [
    {
        x: 0b011010001000011000011000001001,
        y: 0b100011011100010010000000010000,
    }
]

const App = {
    mapPointOrder: ['cc', 'gy', 'zf', 'zy', 'hz', 'mc', 'b1', 'b2', 'b3', 'b4'],
    lv: 0,
    size: 100,
    initMap() {
        let { x, y} = LevelMap[this.lv];
        let mapElem = document.querySelector('.map');
        mapElem.innerHTML = '';
        this.mapPointOrder.forEach((item, index) => {
            let elem = document.createElement('div');
            elem.className = item;
            elem.style.left = (x & 7) * 100 + 'px';
            elem.style.top = (y & 7) * 100 + 'px';
            mapElem.appendChild(elem);

            x >>= 3;
            y >>= 3;
        });
    },
    init() {
        this.initMap();
    }
}

App.init();