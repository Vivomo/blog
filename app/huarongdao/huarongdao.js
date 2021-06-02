const LevelMap = [
    {
        xAxis: 0b011010001000011000011000001001,
        yAxis: 0b100011011100010010000000010000,
    }
]

const App = {
    mapPointOrder: ['cc', 'gy', 'zf', 'zy', 'hz', 'mc', 'b1', 'b2', 'b3', 'b4'],
    lv: 0,
    size: 100,
    mapBit: null,
    initMapBit() {
        this.mapBit = Array(5).fill(0).map(_ => Array(4).fill(0));
    },
    setMapInit(x, y, category) {
        this.mapBit[y][x] = 1;
        switch (category) {
            case 'zf':
            case 'zy':
            case 'hz':
            case 'mc':
                this.mapBit[y + 1][x] = 1;
                break;
            case 'gy':
                this.mapBit[y][x + 1] = 1;
                break;
            case 'cc':
                this.mapBit[y][x + 1] = 1;
                this.mapBit[y + 1][x] = 1;
                this.mapBit[y + 1][x + 1] = 1;
        }
    },
    initMap() {
        this.initMapBit();
        let { xAxis, yAxis} = LevelMap[this.lv];
        let mapElem = document.querySelector('.map');
        mapElem.innerHTML = '';
        this.mapPointOrder.forEach((item, index) => {
            let x = xAxis & 7;
            let y = yAxis & 7;
            xAxis >>= 3;
            yAxis >>= 3;
            this.setMapInit(x, y, item);
            let elem = document.createElement('div');
            elem.className = `${item} block`;
            elem.style.left = x * 100 + 'px';
            elem.style.top = y * 100 + 'px';
            mapElem.appendChild(elem);
        });
    },
    init() {
        this.initMap();
        console.log(this.mapBit)
    }
}

App.init();