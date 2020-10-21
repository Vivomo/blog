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
    /**
     * 移动猫, 移动后判断边界, 是否游戏结束
     * @param x
     * @param y
     * @param direction 移动方向,与动画有关
     */
    move({x, y, direction}) {
        let target = this.rowElem[y].children[x];
        this.cat.style.left = target.offsetLeft - this.catWidth / 2 + this.ceilWidth / 2 + 'px';
        this.cat.style.top = target.offsetTop - this.catHeight * 0.75 + this.ceilHeight / 2 + 'px';
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
    /**
     * 游戏结束, 赋值对应状态
     */
    gameOver() {
        this.end = true;
        this.cat.classList.add('end');
    },
    /**
     * 初始化html, 并设置猫和地图点的数据
     */
    initHtml() {
        this.wrap.querySelector('.map').innerHTML = new Array(MAP_WIDTH).fill(0).map((_, rowIndex) => {
            let items = new Array(MAP_WIDTH).fill(0).map((_, colIndex) =>
                `<div class="point" data-y="${rowIndex}" data-x="${colIndex}"></div>`).join('');
            return `<div class="row">${items}</div>`;
        }).join('');
        this.rowElem = this.wrap.querySelectorAll('.row');
        this.cat = this.wrap.querySelector('.cat');
        this.catWidth = this.cat.offsetWidth;
        this.catHeight = this.cat.offsetHeight;
        let ceil = this.wrap.querySelector('.point');
        this.ceilWidth = ceil.offsetWidth;
        this.ceilHeight = ceil.offsetHeight;
    },
    /**
     * 初始化地图, 并随机生成7个随机点
     */
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
    /**
     * 事件绑定
     * 地图点击逻辑 和 重新开始
     */
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
            let x = ~~data.x;
            let y = ~~data.y;
            if (x === this.catX && y === this.catY) {
                return;
            }
            this.activate({x, y});
            this.findWay();
        });

        document.querySelector('.restart').addEventListener('click', () => {
            this.restart();
        });
    },
    /**
     * 重新开始
     */
    restart() {
        this.end = false;
        this.activatedList = [];
        this.cat.className = 'cat';
        this.init(false);
    },
    /**
     * 生成猫的拦截点
     * @param x
     * @param y
     */
    activate({x, y}) {
        let point = this.map[y][x];
        if (point.active || (this.catX === x && this.catY === y)) {
            return;
        }
        point.activate = true;
        this.rowElem[y].children[x].classList.add('active');
        this.activatedList.push({x, y});
    },
    /**
     * 生成地图初始状态的映射数组
     * @returns {{active: boolean}[][]}
     */
    createMap() {
        return new Array(MAP_WIDTH).fill(0).map(_ => {
            return new Array(MAP_WIDTH).fill(0).map(_ => ({active: false}));
        });
    },
    /**
     * 生成地图的映射数组, 包含拦截点
     * @returns {*|{active: boolean}[][]}
     */
    getActiveDataMap() {
        let tempMap = this.createMap();
        for (let point of this.activatedList) {
            tempMap[point.y][point.x].active = true;
        }
        tempMap[this.catY][this.catX].active = true;
        return tempMap;
    },
    /**
     * 边界判断
     * @param x
     * @param y
     * @returns {boolean}
     */
    isBoundary(x, y) {
        let maxIndex = MAP_WIDTH - 1;
        return x === 0 || x === maxIndex || y === 0 || y === maxIndex;
    },
    /**
     * bfs随机寻路, 随机应用在洗牌算法打乱上一次寻得的点, 避免总是偏向于某一固定方向
     * 寻路执行后,会判断是否已是围住状态, 如果是则执行游戏成功方法
     */
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
            this.disarrange(newErgodicPoint);
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
    /**
     * 打乱寻路节点, 避免每次都是固定方向
     */
    disarrange(points) {
        for (let i = 0, l = points.length; i < l; i++) {
            let randomIndex = ~~(Math.random() * l);
            let temp = points[i];
            points[i] = points[randomIndex];
            points[randomIndex] = temp;
        }
    },
    /**
     * 游戏成功
     */
    showSuccess() {
        this.end = true;
        this.cat.classList.add('success');
    },
    /**
     * 清除路径距离提示, debug模式专用
     */
    clearPath() {
        for (let row of this.rowElem) {
            for (let elem of row.children) {
                elem.innerHTML = '';
            }
        }
    },
    /**
     * 显示路径距离提示, debug模式专用
     */
    showPath(ergodicPoint, distance) {
        ergodicPoint.forEach(({x, y}) => {
            this.rowElem[y].children[x].innerHTML = distance;
        });
    },
    /**
     * 找出在边界的点
     * @param points
     * @returns {*}
     */
    getBoundaryPoint(points) {
        return points.find(({x, y}) => this.isBoundary(x, y));
    },
    /**
     * 从参照点6个方向获取下一个非拦截点, 并与参照点建立连接 (prev字段)
     * @param point
     * @param map
     * @returns {[]}
     */
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
    /**
     * 将非拦截点改为拦截点
     * @param map
     * @param points
     * @param x
     * @param y
     * @param direction
     */
    pushIfNotActive(map, points, x, y, direction) {
        if (!map[y][x].active) {
            points.push({x, y, direction});
            map[y][x].active = true;
        }
    },
    /**
     * 初始化
     * @param first 是否是第一次
     */
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