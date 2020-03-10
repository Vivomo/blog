let masterData = [[0,2,4],[0,3,6],[0,5,2],[1,0,6],[1,4,3],[1,8,4],[2,1,2],[2,3,4],[2,7,9],[3,0,9],[3,1,8],[3,6,3],[3,7,5],[4,0,1],[4,2,3],[4,7,4],[5,1,6],[5,6,8],[5,8,7],[6,1,3],[6,4,2],[6,7,7],[7,4,6],[7,5,1],[7,8,5],[8,2,9],[8,3,3],[8,6,4]];
let middleData = [[0,0,4],[0,2,3],[0,5,1],[0,7,2],[1,1,2],[1,2,6],[1,4,7],[1,8,5],[3,0,2],[3,3,8],[3,5,6],[3,7,3],[4,0,3],[4,1,6],[4,5,9],[5,3,2],[5,7,9],[5,8,4],[6,0,7],[6,3,3],[6,6,4],[6,7,8],[7,1,5],[7,4,8],[7,6,3],[7,8,2]];
let hardest = [[0,0,8],[1,2,3],[1,3,6],[2,1,7],[2,4,9],[2,6,2],[3,1,5],[3,5,7],[4,4,4],[4,5,5],[4,6,7],[5,3,1],[5,7,3],[6,2,1],[6,7,6],[6,8,8],[7,2,8],[7,3,5],[7,7,1],[8,1,9],[8,6,4]];

// Flag 0(已推出) 0(不唯一) 0000(r) 0000(c|r|t)
const HAS_SET_FLAG =    0b10000000000;
const NOT_ONLY_FLAG =    0b1000000000;
const ROW_FLAG =           0b11110000;
const COL_FLAG =               0b1111;

const delay = (t, v) => {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, v), t)
    })
};

Promise.prototype.delay = function(t) {
    return this.then(function(v) {
        return delay(t, v);
    });
};

let Util = {
    getTableFirstR: t => ~~(t / 3) * 3,
    getTableFirstC: t => (t % 3) * 3,
    getTIndex: (r, c) => ~~(r / 3) * 3 + ~~(c / 3),
    indexInSection: (index, section) => index >= section && index < section + 3,
    rInTable: (r, t) => Util.indexInSection(r, Util.getTableFirstR(t)),
    cInTable: (c, t) => Util.indexInSection(c, Util.getTableFirstC(t)),
    removeArrElem: (arr, elem) => {
        if (Array.isArray(arr)) {
            let index = arr.indexOf(elem);
            index !== -1 && arr.splice(index, 1);
        }
    }
};

const App = {
    backups: [],
    guessIndex: [],
    example: [middleData, masterData, hardest],
    auto: false,
    consoleType: '',
    activeElem: null,
    delayTime: 0,
    set activeCeil({r, c}){
        this.activeElem && this.activeElem.classList.remove('active');
        this.activeElem = this.wrap.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        this.activeElem.classList.add('active');
    },
    setCeil(value, mark) {
        if (!this.activeElem || this.activeElem.dataset.value) {
            return;
        }
        let data = this.activeElem.dataset;
        let {r, c} = data;
        
        if (!this.virtualData[r][c].includes(value)) {
            console.error('invalid data', value, r, c);
            return;
        }
        this.update = true;
        data.value = value;

        this.virtualData[r][c] = {value, mark};

        this.virtualData[r].forEach((item) => {
            Util.removeArrElem(item, value);
        });

        this.eachRow((row) => {
            let item = row[c];
            Util.removeArrElem(item, value);
        });

        let tIndex = Util.getTIndex(r, c);
        this.eachTableItem(tIndex, (item) => {
            Util.removeArrElem(item, value);
        });

        this.activeElem.innerHTML = value;
        if (mark) {
            this.activeElem.classList.add('mark');
        }
        
        this.removeTemp(`[data-r="${r}"] .temp${value}, [data-c="${c}"] .temp${value}, .t${tIndex} .temp${value}`);
    },
    isValid() {
        let result = true;
        this.eachRow((row) => {
            result = row.every(item => !Array.isArray(item) || item.length > 0);
            if (!result) {
                return false;
            }
        });
        return result;
    },
    isAllInferred() {
        let done = true;
        this.eachRow((row) => {
            done = row.every(item => !Array.isArray(item));
            if (!done) {
                return false;
            }
        });
        return done;
    },
    log(...args) {
        console.log(...args);
        let div = document.createElement('div');
        div.className = this.consoleType;
        div.innerHTML = args.join(' ');
        this.console.appendChild(div);
        this.consoleType = '';
        this.console.scrollTop = this.console.scrollHeight;
    },
    warn(...args) {
        this.consoleType = 'warn';
        this.log(...args);
    },
    error(...args) {
        this.consoleType = 'error';
        this.log(...args);
    },

    infer() {
        this.update = false;
        delay(this.delayTime).then(this.inferRow.bind(this))
            .delay(this.delayTime).then(this.inferCol.bind(this))
            .delay(this.delayTime).then(this.inferTable.bind(this))
            .delay(this.delayTime).then(this.inferTableColRow.bind(this))
            .delay(this.delayTime).then(this.inferColRowTable.bind(this))
            .delay(this.delayTime).then(this.loopInfer.bind(this));
    },
    loopInfer() {
        if (this.update) {
            if (!this.isValid()) {
                this.error('数据矛盾');
                if (this.auto) {
                    this.retreated();
                    this.inferGuess();
                }
                return;
            }
            if (this.isAllInferred()) {
                this.log('done');
                this.auto = false;
                return;
            }
            if (this.auto) {
                this.infer();
            }
        } else {
            this.warn('无法进一步推导');
            if (this.auto) {
                this.inferGuess(true);
            }
        }
    },
    inferRow() {
        this.eachRow((row, rowIndex) => {
            let counter = {};
            row.forEach((item, colIndex) => {
                this.setArrCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchCounter(counter);
        });
    },
    inferCol() {
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            let counter = {};
            this.eachRow((row, rowIndex) => {
                let item = row[colIndex];
                this.setArrCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchCounter(counter);
        }
    },
    inferTable() {
        for (let tIndex = 0; tIndex < 9; tIndex++) {
            let counter = {};
            this.eachTableItem(tIndex, (item, rowIndex, colIndex) => {
                this.setArrCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchCounter(counter);
        }
    },
    inferTableColRow() {
        for (let tIndex = 0; tIndex < 9; tIndex++) {
            let rCounter = {};
            let cCounter = {};
            this.eachTableItem(tIndex, (item, rowIndex, colIndex) => {
                this.setArrCounter(item, rCounter, rowIndex);
                this.setArrCounter(item, cCounter, colIndex);
            });
            this.dispatchTableRCounter(tIndex, rCounter);
            this.dispatchTableCCounter(tIndex, cCounter);
        }
    },
    inferColRowTable() {
        this.eachRow((row, rowIndex) => {
            let counter = {};
            row.forEach((item, colIndex) => {
                this.setArrCounter(item, counter, Util.getTIndex(rowIndex, colIndex));
            });
            this.dispatchRCTableCounter(counter, rowIndex)
        });
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            let counter = {};
            this.eachRow((row, rowIndex) => {
                this.setArrCounter(row[colIndex], counter, Util.getTIndex(rowIndex, colIndex));
            });
            this.dispatchRCTableCounter(counter, null, colIndex);
        }
    },
    eachTableItem(tIndex, fn) {
        let startRow = Util.getTableFirstR(tIndex);
        let startCol = Util.getTableFirstC(tIndex);
        for (let rowIndex = startRow; rowIndex < startRow + 3; rowIndex++) {
            for (let colIndex = startCol; colIndex < startCol + 3; colIndex++) {
                let item = this.virtualData[rowIndex][colIndex];
                fn(item, rowIndex, colIndex)
            }
        }
    },
    eachRow(fn) {
        this.virtualData.every((row, rowIndex) => fn(row, rowIndex) !== false);
    },
    setArrCounter(item, counter, rct, c) {
        let multi = c === undefined;
        if (Array.isArray(item)) {
            // multi 时 r & c 信息不全
            if (item.length === 1 && !multi) {
                counter[item[0]] = c | (rct << 4);
                return;
            }
            item.forEach((num) => {
                if (counter[num] === undefined) {
                    counter[num] = multi ? rct : c | (rct << 4);
                } else {
                    if (!multi || rct !== counter[num]) {
                        counter[num] = NOT_ONLY_FLAG;
                    }
                }
            });
        } else {
            counter[item.value] = HAS_SET_FLAG;
        }
    },
    eachOnlyOneCounter(counter, fn) {
        Object.entries(counter).forEach(([num, value]) => {
            if (!(value & HAS_SET_FLAG) && !(value & NOT_ONLY_FLAG)) {
                fn(~~num, value);
            }
        });
    },
    dispatchCounter(counter) {
        this.eachOnlyOneCounter(counter, (num, value) => {
            let r = (value & ROW_FLAG) >> 4;
            let c = value & COL_FLAG;
            this.activeCeil = {r, c};
            this.setCeil(num);
            this.log(`infer(${r+1}, ${c+1}) =>`, num);
        });
    },
    dispatchTableRCounter(tIndex, counter) {
        this.eachOnlyOneCounter(counter, (num, value) => {
            // table rct 都用在col 位置(低位)
            let r = value & COL_FLAG;
            this.virtualData[r].forEach((item, colIndex) => {
                if (!Util.cInTable(colIndex, tIndex)) {
                    Util.removeArrElem(item, num)
                }
            });
            this.removeTemp(`.t:not(.t${tIndex}) [data-r="${r}"] .temp${num}`);
        });
    },
    dispatchTableCCounter(tIndex, counter) {
        this.eachOnlyOneCounter(counter, (num, value) => {
            let c = value & COL_FLAG;
            this.eachRow((row, rowIndex) => {
                let item = row[c];
                if (!Util.rInTable(rowIndex, tIndex)) {
                    Util.removeArrElem(item, num)
                }
            });
            this.removeTemp(`.t:not(.t${tIndex}) [data-c="${c}"] .temp${num}`);
        });
    },
    dispatchRCTableCounter(counter, rowIndex, colIndex) {
        this.eachOnlyOneCounter(counter, (num, value) => {
            let tIndex = value & COL_FLAG;
            this.eachTableItem(tIndex, (item, _rowIndex, _colIndex) => {
                let valid = rowIndex === null ? colIndex !== _colIndex : rowIndex !== _rowIndex;
                valid && Util.removeArrElem(item, num);
            });
            let selector = rowIndex === null ? `[data-c="${colIndex}"]` : `[data-r="${rowIndex}"]`;
            this.removeTemp(`.t${tIndex} .ceil:not(${selector}) .temp${num}`);
        });
    },
    removeTemp(selector) {
        this.find(selector).forEach((temp) => {
            temp.remove();
        });
    },
    getMinLengthTemp() {
        let r, c, arr;
        let minLength = 10;
        this.eachRow((row, rowIndex) => {
            let findMin = row.some((item, colIndex) => {
                if (Array.isArray(item)) {
                    if (item.length < minLength) {
                        minLength = item.length;
                        r = rowIndex;
                        c = colIndex;
                        arr = item;
                    }
                    if (item.length === 2) {
                        return true;
                    }
                }
            });
            if (findMin) {
                return false;
            }
        });
        return {r, c, arr};
    },
    inferGuess(isNew) {
        let guessIndex = this.guessIndex;
        let {r, c, arr} = this.getMinLengthTemp();
        let index;
        if (isNew) {
            index = 0;
            guessIndex.push(index);
            this.save();
        } else {
            index = guessIndex[guessIndex.length - 1] + 1;
            if (index === arr.length) {
                guessIndex.pop();
                this.log('进一步回档');
                this.retreated();
                this.inferGuess();
                return;
            }
        }

        if (arr[index] === undefined) {
            alert('无解');
            return;
        }
        this.log(`guess(${r+1},${c+1})==>${arr[index]}`);
        this.activeCeil = {r, c};
        this.setCeil(arr[index]);
        if (this.auto) {
            this.infer();
        }
    },
    save() {
        let data = JSON.stringify(this.virtualData);
        let backups = this.backups;
        if (backups.length > 0 && backups[backups.length - 1] === data) {
            return;
        }
        this.backups.push(data);
        this.log('存档');
    },
    retreated() {
        let data = this.backups.pop();
        if (!data) {
            return;
        }
        data = JSON.parse(data);
        this.virtualData = data;
        this.find('.ceil').forEach((ceil) => {
            let {r, c} = ceil.dataset;
            let ceilData = data[r][c];
            if (Array.isArray(ceilData)) {
                ceil.dataset.value = '';
                ceil.innerHTML = ceilData.map(temp => `<div class="temp temp${temp}">${temp}</div>`).join('');
            } else {
                ceil.innerHTML = ceilData.value;
                if (ceilData.mark) {
                    ceil.classList.add('mark');
                }
            }
        });
        this.log('回档');
        
    },
    find(selector) {
        return Array.from(this.wrap.querySelectorAll(selector));
    },
    initHtml () {
        let wrap = this.wrap = document.querySelector('.wrap');
        wrap.innerHTML = new Array(9).fill(null).map((item, outerIndex) => {
            let _html = new Array(9).fill(null).map((innerItem, innerIndex) => {
                let tempHtml = new Array(9).fill(null).map((temp, tempIndex) => {
                    return `<div class="temp temp${tempIndex + 1}">${tempIndex + 1}</div>`
                }).join('');
                return `<div 
                            data-r="${~~(outerIndex / 3) * 3 + ~~(innerIndex / 3)}" 
                            data-c="${(outerIndex % 3) * 3 + (innerIndex % 3)}" 
                            class="ceil">${tempHtml}</div>`
            }).join('');
            return `<div class="t t${outerIndex}">${_html}</div>`;
        }).join('');
        this.console = document.querySelector('.console');
        this.console.innerHTML = '';
    },
    initEvent () {
        this.wrap.addEventListener('click', (e) => {
            if (e.target.className === 'ceil') {
                this.activeCeil = e.target.dataset
            }
        });

        document.querySelector('.opt').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.dataset.value) {
                this.setCeil(~~e.target.dataset.value, true);
            }
        });

        document.querySelector('.clear').addEventListener('click', () => {
            this.init(false);
        });
        document.querySelector('.infer').addEventListener('click', this.infer.bind(this));
        document.querySelector('.auto-infer').addEventListener('click', () => {
            this.auto = true;
            this.infer();
        });
        document.querySelector('.save').addEventListener('click', this.save.bind(this));
        document.querySelector('.retreated').addEventListener('click', this.retreated.bind(this));
        document.querySelector('.import').addEventListener('click', () => {
            this.init(false);
            this.setDefaultData(this.example[document.querySelector('#data-select').value])
        });

        document.querySelector('.toggle-console').addEventListener('click', () => {
            this.console.classList.toggle('show');
        });
        
        document.addEventListener('keydown', (e) => {
            if (/\d/.test(e.key)) {
                this.setCeil(~~e.key, true);
            }
        });
    },
    initVirtualData() {
        this.virtualData = new Array(9).fill(null).map(() => {
            return new Array(9).fill(null).map(() => {
                let arr = [];
                for (let i = 1; i < 10; i++) {
                    arr.push(i);
                }
                return arr;
            });
        });
    },
    setDefaultData(data) {
        data.forEach((item) => {
            let [r, c, value] = item;
            this.activeCeil = {r , c};
            this.setCeil(value, true);
        });
    },
    init(initEvent = true) {
        this.auto = false;
        this.backups = [];
        this.guessIndex = [];

        this.initHtml();
        initEvent && this.initEvent();
        this.initVirtualData();
    }
};

App.init();
