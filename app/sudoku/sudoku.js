const App = {
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
        data.value = value;
        let {r, c} = data;
        
        activeElem.innerHTML = value;
        if (mark) {
            activeElem.classList.add('mark');
        }

        this.virtualData[r - 1][c - 1] = {
            value,
            mark
        };

        this.virtualData[r - 1].forEach((item) => {
            this.removeArrElem(item, value);
        });

        this.virtualData.forEach((row) => {
            let item = row[c - 1];
            this.removeArrElem(item, value);
        });
        
        Array.from(document.querySelectorAll(`[data-r="${r}"] .temp${value}, [data-c="${c}"] .temp${value}`)).forEach((ceil) => {
            ceil.remove();
        });

        Array.from(activeElem.parentNode.querySelectorAll(`.temp${value}`)).forEach((ceil) => {
            ceil.remove();
        });
    },
    derivation() {
        this.virtualData.forEach((row, rowIndex) => {
            let counter = {};
            row.forEach((item, colIndex) => {
                this.setArrCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchCounter(counter);
        });

        for (let colIndex = 0; colIndex < 9; colIndex++) {
            let counter = {};
            this.virtualData.forEach((row, rowIndex) => {
                let item = row[colIndex];
                this.setArrCounter(item, counter, rowIndex, colIndex);
            });
            this.dispatchCounter(counter);
        }

        for (let tIndex = 0; tIndex < 9; tIndex++) {
            let counter = {};
            let startRow = ~~(tIndex / 3) * 3;
            let startCol = (tIndex % 3) * 3;
            for (let rowIndex = startRow; rowIndex < startRow + 3; rowIndex++) {
                for (let colIndex = startCol; colIndex < startCol + 3; colIndex++) {
                    let item = this.virtualData[rowIndex][colIndex];
                    this.setArrCounter(item, counter, rowIndex, colIndex);
                }
            }
            this.dispatchCounter(counter);
        }
    },
    setArrCounter(item, counter, rowIndex, colIndex) {
        if (Array.isArray(item)) {
            item.forEach((num) => {
                if (counter[num]) {
                    counter[num] = 2
                } else {
                    counter[num] = `${rowIndex}_${colIndex}`;
                }
            });
        }
    },
    dispatchCounter(counter) {
        for (let k in counter) {
            if (typeof counter[k] === 'string') {
                let [r, c] = counter[k].split('_');
                console.log(r, c, 'derivation');
                this.activeCeil = {
                    r: r + 1,
                    c: c + 1
                };
                this.setCeil(k);
            }
        }
    },
    removeArrElem(arr, elem) {
        if (Array.isArray(arr)) {
            arr.splice(arr.indexOf(elem), 1);
        }
    },
    initHtml () {
        let wrap = this.wrap = document.querySelector('.wrap');
        let html = new Array(9).fill(null).map((item, outerIndex) => {
            let _html = new Array(9).fill(null).map((innerItem, innerIndex) => {
                let tempHtml = new Array(9).fill(null).map((temp, tempIndex) => {
                    return `<div class="temp temp${tempIndex + 1}">${tempIndex + 1}</div>`
                }).join('');
                return `<div 
                            data-r="${~~(outerIndex / 3) * 3 + ~~(innerIndex / 3) + 1}" 
                            data-c="${(outerIndex % 3) * 3 + (innerIndex % 3) + 1}" 
                            class="ceil">${tempHtml}</div>`
            }).join('');
            return `<div class="t t${outerIndex + 1}">${_html}</div>`;
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
            if (e.target.tagName === 'BUTTON') {
                this.setCeil(~~e.target.dataset.value);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (/\d/.test(e.key)) {
                this.setCeil(~~e.key, e.altKey)
            }
        })
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
    init() {
        this.initHtml();
        this.initEvent();
        this.initVirtualData();
    }
}

App.init();