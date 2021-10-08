import LevelMap from './levelMap.js';

const App = {
    mapPointOrder: ['cc', 'gy', 'zf', 'zy', 'hz', 'mc', 'b1', 'b2', 'b3', 'b4'],
    lv: 0,
    size: 100,
    mapBit: null,
    moveCfg: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
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
    updateMoveCfg(target) {

    },
    getBlocksPoints(blocks) {
        return blocks.map((block) => {
            let data = block.dataset;
            let { x, y } = data;
            let points = [[x, y]];
            switch (data.category) {
                case 'cc':
                    return points.concat([[ x, y + 1 ], [x + 1, y], [x + 1, y + 1]]);
                case 'gy':
                    return points.concat([[x + 1, y]]);
                case 'zf':
                case 'zy':
                case 'hz':
                case 'mc':
                    return points.concat([[x, y + 1]]);
                default:
                    return points;
            }
        });
    },
    initMap() {
        this.initMapBit();
        let { xAxis, yAxis} = LevelMap[this.lv];
        let mapElem = this.mapElem = document.querySelector('.map');
        mapElem.innerHTML = '';
        this.mapPointOrder.forEach((item, index) => {
            let x = xAxis & 7;
            let y = yAxis & 7;
            xAxis >>= 3;
            yAxis >>= 3;
            this.setMapInit(x, y, item);
            let elem = document.createElement('div');
            elem.dataset.category = item;
            elem.dataset.x = x;
            elem.dataset.y = y;
            elem.className = `${item} block`;
            elem.style.left = x * this.size + 'px';
            elem.style.top = y * this.size + 'px';
            mapElem.appendChild(elem);
        });
    },
    initEvent() {
        let startX = 0;
        let startY = 0;
        let movedBlockPoints = [];
        let staticBlockPoints = [];
        let onPointerMove = (e) => {
            let block = e.target;
            let mX = e.pageX;
            let mY = e.pageY;

        };
        this.mapElem.addEventListener('pointerdown', (e) => {
            console.log(e)
            let target = e.target;
            if (!target.classList.contains('block')) {
                return;
            }
            startX = e.pageX;
            startY = e.pageY;
            movedBlockPoints = this.getBlocksPoints([e.target]);
            let staticBlocks = [...this.mapElem.querySelectorAll('.block')].filter(block => block !== e.target);
            staticBlockPoints = this.getBlocksPoints(staticBlocks);
            this.mapElem.addEventListener('pointermove', onPointerMove);
        });
        this.mapElem.addEventListener('pointerup', () => {
            this.mapElem.removeEventListener('pointermove', onPointerMove)
        })
    },
    init() {
        this.initMap();
        this.initEvent();
        console.log(this.mapBit)
    }
}

App.init();