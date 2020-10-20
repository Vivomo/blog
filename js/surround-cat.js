const MAP_WIDTH = 13;

let App = {
    wrap: document.getElementById('wrap'),
    rowElem: null,
    cat: null,
    catWidth: null,
    catHeight: null,
    catX: null,
    catY: null,
    ceilWidth: null,
    ceilHeight: null,
    catDirection: null,
    map: null,
    activatedList: [],
    end: false,
    debug: false,
    move({x, y, direction}) {
        let target = this.rowElem[y].children[x];
        this.cat.style.left = target.offsetLeft - this.catWidth / 2 + this.ceilWidth / 2 + 'px';
        this.cat.style.top = target.offsetTop - this.catHeight + this.ceilHeight / 2 + 'px';
        this.catX = x;
        this.catY = y;
        this.cat.classList.remove('d' + this.catDirection);
        requestAnimationFrame(() => {
            if (direction !== undefined) {
                this.catDirection = direction;
                this.cat.classList.add('d' + direction);
            }
        });
        if (this.isBoundary(x, y)) {
            this.gameOver();
        }
    },
    gameOver() {
        this.end = true;
        this.cat.classList.add('end');
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
        let mid = ~~(MAP_WIDTH / 2);
        let points = [{x: mid, y: mid}];
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
            if (this.end) {
                return;
            }
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

        document.querySelector('.restart').addEventListener('click', () => {
            this.restart();
        });
    },
    restart() {
        this.end = false;
        this.activatedList = [];
        this.cat.remove();
        this.init(false);
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
    getActiveDataMap() {
        let tempMap = this.createMap();
        for (let point of this.activatedList) {
            tempMap[point.y][point.x].active = true;
        }
        tempMap[this.catY][this.catX].active = true;
        return tempMap;
    },
    isBoundary(x, y) {
        let maxIndex = MAP_WIDTH - 1;
        return x === 0 || x === maxIndex || y === 0 || y === maxIndex;
    },
    findWay() {
        if (App.debug) {
            this.clearPath();
        }
        let tempMap = this.getActiveDataMap();
        let ergodicPoint = [{x: this.catX, y: this.catY}];
        let success = false;
        let distance = 0;
        while (true) {
            let newErgodicPoint = [];
            ergodicPoint.forEach((point) => {
                newErgodicPoint.push(...this.getNextPoints(point, tempMap));
            });
            if (newErgodicPoint.length === 0) {
                if (distance === 0) {
                    success = true;
                } else {
                    // 随机走一步
                    let nextPoints = this.getNextPoints({x: this.catX, y: this.catY}, this.getActiveDataMap());
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
                break;
            }
            ergodicPoint = newErgodicPoint;
            distance++;
            if (App.debug) {
                this.showPath(ergodicPoint, distance);
            }
        }

        if (success) {
            this.showSuccess();
        }

    },
    showSuccess() {
        this.end = true;
        this.cat.classList.add('success');
    },
    clearPath() {
        for (let row of this.rowElem) {
            for (let elem of row.children) {
                elem.innerHTML = '';
            }
        }
    },
    showPath(ergodicPoint, distance) {
        ergodicPoint.forEach(({x, y}) => {
            this.rowElem[y].children[x].innerHTML = distance;
        });
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
    init(first = true) {
        this.initHtml();
        this.initMap();
        if (first) {
            this.initEvent();
        }

        let mid = ~~(MAP_WIDTH / 2);
        this.move({
            x: mid,
            y: mid
        });
    }
};

// App.debug = true;
App.init();