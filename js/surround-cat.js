const MAP_WIDTH = 13;

let App = {
    wrap: document.getElementById('wrap'),
    colElem: null,
    rowElem: null,
    cat: null,
    catWidth: null,
    catHeight: null,
    catX: null,
    catY: null,
    ceilWidth: null,
    ceilHeight: null,
    map: null,
    activatedList: [],
    move({x, y, direction}) {
        let target = this.rowElem[y].children[x];
        this.cat.style.left = target.offsetLeft - this.catWidth / 2 + this.ceilWidth / 2 + 'px';
        this.cat.style.top = target.offsetTop - this.catHeight + this.ceilHeight / 2 + 'px';
        this.catX = x;
        this.catY = y;
    },
    initHtml() {
        this.wrap.querySelector('.map').innerHTML = new Array(MAP_WIDTH).fill(0).map((_, rowIndex) => {
            let items = new Array(MAP_WIDTH).fill(0).map((_, colIndex) =>
                `<div class="point" data-y="${rowIndex}" data-x="${colIndex}"></div>`).join('');
            return `<div class="row">${items}</div>`;
        }).join('');
        let cat = this.cat = document.createElement('div');
        cat.className = 'cat';
        this.wrap.appendChild(cat);
        this.rowElem = this.wrap.querySelectorAll('.row');
        this.cat = this.wrap.querySelector('.cat');
        this.catWidth = this.cat.offsetWidth;
        this.catHeight = this.cat.offsetHeight;
        let ceil = this.wrap.querySelector('.point');
        this.ceilWidth = ceil.offsetWidth;
        this.catHeight = ceil.offsetHeight;
    },
    initMap() {
        this.map = this.createMap();
        let points = [{x: 5, y: 5}];
        while (points.length < 8) {
            let x = ~~(Math.random() * MAP_WIDTH);
            let y = ~~(Math.random() * MAP_WIDTH);
            if (this.isBoundary(x, y)) {
                continue;
            }
            let isCreated = points.some(point => point.x === x && point.y === y);
            if (!isCreated) {
                points.push({x, y});
            }
        }
        points.slice(1).forEach((point) => {
            this.activate(point);
        });
    },
    initEvent() {
        this.wrap.addEventListener('click', (e) => {
            let target = e.target;
            let classList = target.classList;
            if (!classList.contains('point')) {
                return;
            }
            if (classList.contains('active')) {
                return;
            }
            let data = target.dataset;
            this.activate({
                x: ~~data.x,
                y: ~~data.y
            });
            this.findWay();
        });
    },
    activate({x, y}) {
        let point = this.map[y][x];
        if (point.active || (this.catX === x && this.catY === y)) {
            return;
        }
        point.activate = true;
        this.rowElem[y].children[x].classList.add('active');
        this.activatedList.push({x, y});
    },
    createMap() {
        return new Array(MAP_WIDTH).fill(0).map(_ => {
            return new Array(MAP_WIDTH).fill(0).map(_ => ({active: false}));
        });
    },
    isBoundary(x, y) {
        let maxIndex = MAP_WIDTH - 1;
        return x === 0 || x === maxIndex || y === 0 || y === maxIndex;
    },
    findWay() {
        let tempMap = this.createMap();
        for (let point of this.activatedList) {
            tempMap[point.y][point.x].active = true;
        }
        let ergodicPoint = [{x: this.catX, y: this.catY}];

        let success = false;
        let distance = 1;
        while (true) {
            let newErgodicPoint = [];
            ergodicPoint.forEach((point) => {
                newErgodicPoint.push(...this.getNextPoints(point, tempMap));
            });
            if (newErgodicPoint.length === 0) {
                if (distance === 1) {
                    success = true;
                } else {
                    // 随机走一步
                    let nextPoints = this.getNextPoints({x: this.catX, y: this.catY}, this.createMap());
                    this.move(nextPoints[~~(nextPoints.length * Math.random())])
                }
                break;
            }
            let boundaryPoint = this.getBoundaryPoint(newErgodicPoint);
            if (boundaryPoint) {
                let stack = [boundaryPoint];
                let temp = boundaryPoint;
                while (temp.prev) {
                    temp = temp.prev;
                    stack.push(temp)
                }
                let nextPoint = stack[stack.length - 2];
                this.move(nextPoint);
                console.log(boundaryPoint);
                break;
            }
            ergodicPoint = newErgodicPoint;
            distance++;
        }

    },
    getBoundaryPoint(points) {
        return points.find(({x, y}) => this.isBoundary(x, y));
    },
    getNextPoints(point, map) {
        let {x, y} = point;
        let nextPoints = [];
        // 6个方向
        //  0 1
        // 5 * 2
        //  4 3
        if (y % 2) {
            // 奇数行
            this.pushIfNotActive(map, nextPoints, x, y - 1, 0);
            this.pushIfNotActive(map, nextPoints, x + 1, y - 1, 1);
            this.pushIfNotActive(map, nextPoints, x + 1, y + 1, 3);
            this.pushIfNotActive(map, nextPoints, x, y + 1, 4);
        } else {
            this.pushIfNotActive(map, nextPoints, x - 1, y - 1, 0);
            this.pushIfNotActive(map, nextPoints, x, y - 1, 1);
            this.pushIfNotActive(map, nextPoints, x, y + 1, 3);
            this.pushIfNotActive(map, nextPoints, x - 1, y + 1, 4);
        }
        this.pushIfNotActive(map, nextPoints, x + 1, y, 2);
        this.pushIfNotActive(map, nextPoints, x - 1, y, 5);
        nextPoints.forEach((item) => {
            item.prev = point;
        });
        return nextPoints;
    },
    pushIfNotActive(map, points, x, y, direction) {
        if (!map[y][x].active) {
            points.push({x, y, direction});
            map[y][x].active = true;
        }
    },
    init() {
        this.initHtml();
        this.initMap();
        this.initEvent();

        let mid = ~~(MAP_WIDTH / 2);
        this.move({
            x: mid,
            y: mid
        });
    }
};

App.init();