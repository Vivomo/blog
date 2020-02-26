let masterData = [[0,2,4],[0,3,6],[0,5,2],[1,0,6],[1,4,3],[1,8,4],[2,1,2],[2,3,4],[2,7,9],[3,0,9],[3,1,8],[3,6,3],[3,7,5],[4,0,1],[4,2,3],[4,7,4],[5,1,6],[5,6,8],[5,8,7],[6,1,3],[6,4,2],[6,7,7],[7,4,6],[7,5,1],[7,8,5],[8,2,9],[8,3,3],[8,6,4]];
let middleData = [[0,0,4],[0,2,3],[0,5,1],[0,7,2],[1,1,2],[1,2,6],[1,4,7],[1,8,5],[3,0,2],[3,3,8],[3,5,6],[3,7,3],[4,0,3],[4,1,6],[4,5,9],[5,3,2],[5,7,9],[5,8,4],[6,0,7],[6,3,3],[6,6,4],[6,7,8],[7,1,5],[7,4,8],[7,6,3],[7,8,2]];
let hardest = [[0,0,8],[1,2,3],[1,3,6],[2,1,7],[2,4,9],[2,6,2],[3,1,5],[3,5,7],[4,4,4],[4,5,5],[4,6,7],[5,3,1],[5,7,3],[6,2,1],[6,7,6],[6,8,8],[7,2,8],[7,3,5],[7,7,1],[8,1,9],[8,6,4]];

const App = {
    backups: [],
    guessIndex: [],
    example: [middleData, masterData, hardest],
    auto: false,
    set activeCeil(obj){
        let prevActive = this.wrap.querySelector('.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }
        this.wrap.querySelector(`[data-r="${obj.r}"][data-c="${obj.c}"]`).classList.add('active');
        this._activeCeil = obj;
    },
    setCeil(value, mark) {
        let activeElem = this.wrap.querySelector('.active');
        if (!activeElem || activeElem.dataset.value) {
            return;
        }
        let data = activeElem.dataset;
        let {r, c} = data;
        
        if (!this.virtualData[r][c].includes(value)) {
            console.error('invalid data', value, r, c);
            return;
        }
        this.update = true;
        data.value = value;

        this.virtualData[r][c] = {value, mark};

        this.virtualData[r].forEach((item) => {
            this.removeArrElem(item, value);
        });

        this.eachRow((row) => {
            let item = row[c];
            this.removeArrElem(item, value);
        });

        let tIndex = this.getTIndex(r, c);
        this.eachTableItem(tIndex, (item) => {
            this.removeArrElem(item, value);
        });

        activeElem.innerHTML = value;
        if (mark) {
            activeElem.classList.add('mark');
        }
        
        this.removeTemp(`[data-r="${r}"] .temp${value}, [data-c="${c}"] .temp${value}, .t${tIndex} .temp${value}`);
    },
    isInvalid() {
        let result = true;
        this.eachRow((row) => {
            result = row.every(item => !Array.isArray(item) || item.length > 0);
            if (!result) {
                return false;
            }
        });
        return result;
    },
    isAllInfered() {
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
    },
    infer() {
        this.update = false;
        
        this.inferRow();
        this.inferCol();
        this.inferTable();
        this.inferTableColRow();
        this.inferColRowTable();

        if (this.update) {
            if (!this.isInvalid()) {
                this.log('数据矛盾');
                if (this.auto) {
                    requestAnimationFrame(() => {
                        this.retreated();
                        this.inferGuess();
                    });

                }
                return;
            }
            if (this.isAllInfered()) {
                this.log('done');
                return;
            }
            if (this.auto) {
                requestAnimationFrame(this.infer.bind(this));
            }
        } else {
            this.log('无法进一步推导');
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
                this.setCRCounter(item, rCounter, rowIndex);
                this.setCRCounter(item, cCounter, colIndex);
            });
            this.dispathcTableRCounter(tIndex, rCounter);
            this.dispathcTableCCounter(tIndex, cCounter);
        }
    },
    inferColRowTable() {
        this.eachRow((row, rowIndex) => {
            let counter = {};
            row.forEach((item, colIndex) => {
                this.setRCTableCounter(item, counter, rowIndex, colIndex)
            });
            this.dispatchRCTableCounter(counter, rowIndex)
        });
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            let counter = {};
            this.eachRow((row, rowIndex) => {
                let item = row[colIndex];
                this.setRCTableCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchRCTableCounter(counter, null, colIndex);
        }
    },
    rInTable(rowIndex, tIndex) {
        let startRow = this.getTableFirstR(tIndex);
        return rowIndex >= startRow && rowIndex < startRow + 3;
    },
    cInTable(colIndex, tIndex) {
        let startCol = this.getTableFirstC(tIndex);
        return colIndex >= startCol && colIndex < startCol + 3;
    },
    getTableFirstR(tIndex) {
        return ~~(tIndex / 3) * 3;
    },
    getTableFirstC(tIndex) {
        return (tIndex % 3) * 3;
    },
    getTIndex(r, c) {
        return ~~(r / 3) * 3 + ~~(c / 3);
    },
    eachTableItem(tIndex, fn) {
        let startRow = this.getTableFirstR(tIndex);
        let startCol = this.getTableFirstC(tIndex);
        for (let rowIndex = startRow; rowIndex < startRow + 3; rowIndex++) {
            for (let colIndex = startCol; colIndex < startCol + 3; colIndex++) {
                let item = this.virtualData[rowIndex][colIndex];
                fn(item, rowIndex, colIndex)
            }
        }
    },
    eachRow(fn) {
        this.virtualData.every((row, rowIndex) => {
            let result = fn(row, rowIndex);
            if (result === false) {
                return false;
            }
            return true;
        });
    },
    setArrCounter(item, counter, rowIndex, colIndex) {
        if (Array.isArray(item)) {
            if (item.length === 1) {
                this.log(`infer(${~~rowIndex+1}, ${~~colIndex+1}) =>`, item[0]);
                this.activeCeil = {r: rowIndex, c: colIndex};
                this.setCeil(item[0]);
                counter[item[0]] = true;
                return;
            }
            item.forEach((num) => {
                if (counter[num]) {
                    counter[num] = 2
                } else {
                    counter[num] = `${rowIndex}_${colIndex}`;
                }
            });
        } else {
            counter[item.value] = true;
        }
    },
    setCRCounter(item, counter, cr) {
        if (Array.isArray(item)) {
            item.forEach((num) => {
                if (counter[num]) {
                    if (cr !== ~~counter[num]) {
                        counter[num] = 2
                    }
                } else {
                    counter[num] = `${cr}`;
                }
            });
        } else {
            counter[item.value] = true;
        }
    },
    setRCTableCounter(item, counter, r, c) {
        if (Array.isArray(item)) {
            let tIndex = this.getTIndex(r, c);
            item.forEach((num) => {
                if (counter[num]) {
                    if (tIndex !== ~~counter[num]) {
                        counter[num] = 2
                    }
                } else {
                    counter[num] = `${tIndex}`;
                }
            });
        } else {
            counter[item.value] = true;
        }
    },
    eachOnlyOneCounter(counter, fn) {
        for (let k in counter) {
            if (typeof counter[k] === 'string') {
                let v = counter[k];
                if (/^\d+$/.test(v)) {
                    v = ~~v;
                }
                fn(~~k, v);
            }
        }
    },
    dispatchCounter(counter) {
        this.eachOnlyOneCounter(counter, (k, v) => {
            let [r, c] = v.split('_');
            this.log(`infer(${~~r+1}, ${~~c+1}) =>`, k);
            this.activeCeil = {r,c};
            this.setCeil(k);
        });
    },
    dispathcTableRCounter(tIndex, counter) {
        this.eachOnlyOneCounter(counter, (k, r) => {
            this.virtualData[r].forEach((item, colIndex) => {
                if (!this.cInTable(colIndex, tIndex)) {
                    this.removeArrElem(item, k)
                }
            });
            this.removeTemp(`.t:not(.t${tIndex}) [data-r="${r}"] .temp${k}`);
        });
    },
    dispathcTableCCounter(tIndex, counter) {
        this.eachOnlyOneCounter(counter, (k, c) => {
            this.eachRow((row, rowIndex) => {
                let item = row[c];
                if (!this.rInTable(rowIndex, tIndex)) {
                    this.removeArrElem(item, k)
                }
            });
            this.removeTemp(`.t:not(.t${tIndex}) [data-c="${c}"] .temp${k}`);
        });
    },
    dispatchRCTableCounter(counter, rowIndex, colIndex) {
        this.eachOnlyOneCounter(counter, (k, tIndex) => {
            this.eachTableItem(tIndex, (item, _rowIndex, _colIndex) => {
                if (rowIndex === null) {
                    if (colIndex !== _colIndex) {
                        this.removeArrElem(item, k);
                    }
                } else {
                    if (rowIndex !== _rowIndex) {
                        this.removeArrElem(item, k);
                    }
                }
            });
            if (rowIndex === null) {
                this.removeTemp(`.t${tIndex} .ceil:not([data-c="${colIndex}"]) .temp${k}`);
            } else {
                this.removeTemp(`.t${tIndex} .ceil:not([data-r="${rowIndex}"]) .temp${k}`);
            }
        });
    },
    removeArrElem(arr, elem) {
        if (Array.isArray(arr)) {
            let index = arr.indexOf(elem);
            index !== -1 && arr.splice(index, 1);
        }
    },
    removeTemp(selector) {
        this.find(selector).forEach((temp) => {
            temp.remove();
        });
    },
    getMinLengthTemp() {
        let r, c, arr;
        let minLength = 9;
        this.eachRow((row, rowIndex) => {
            let findMin = row.some((item, colIndex) => {
                if (Array.isArray(item)) {
                    if (item.length < minLength) {
                        minLength = item.length;
                        r = rowIndex,
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
        return {
            r,
            c,
            arr
        }
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
                this.log('进一步回档')
                this.retreated();
                this.inferGuess();
                return;
            }
        }

        if (arr[index] === undefined) {
            alert('无解');
            return;
        }
        this.log(`'guess(${r+1},${c+1})'==>${arr[index]}`)
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
        let html = new Array(9).fill(null).map((item, outerIndex) => {
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
        wrap.innerHTML = html;
    },
    initEvent () {
        this.wrap.addEventListener('click', (e) => {
            if (e.target.className === 'ceil') {
                this.activeCeil = {
                    r: e.target.dataset.r,
                    c: e.target.dataset.c
                }
            }
        });

        document.querySelector('.opt').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.dataset.value) {
                this.setCeil(~~e.target.dataset.value);
            }
        });

        document.querySelector('.infer').addEventListener('click', this.infer.bind(this));
        document.querySelector('.auto-infer').addEventListener('click', () => {
            this.auto = true;
            this.infer();
        });
        document.querySelector('.save').addEventListener('click', this.save.bind(this));
        document.querySelector('.retreated').addEventListener('click', this.retreated.bind(this));
        document.querySelector('.import').addEventListener('click', () => {
            this.setDefaultData(this.example[document.querySelector('#data-select').value])
        });

        let consoleElem = document.querySelector('.console');
        document.querySelector('.toggle-console').addEventListener('click', () => {
            consoleElem.classList.toggle('show');
        });
        
        document.addEventListener('keydown', (e) => {
            if (/\d/.test(e.key)) {
                this.setCeil(~~e.key, e.altKey)
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
    init() {
        this.initHtml();
        this.initEvent();
        this.initVirtualData();
    }
}

App.init();
