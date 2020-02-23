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
        console.log(r, c);
        
        activeElem.innerHTML = value;
        if (mark) {
            activeElem.classList.add('mark');
        }
        
        Array.from(document.querySelectorAll(`[data-r="${r}"] .temp${value}, [data-c="${c}"] .temp${value}`)).forEach((ceil) => {
            ceil.remove();
        });

        Array.from(activeElem.parentNode.querySelectorAll(`.temp${value}`)).forEach((ceil) => {
            ceil.remove();
        })
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
                this.setCeil(e.target.dataset.value);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (/\d/.test(e.key)) {
                this.setCeil(e.key, e.altKey)
            }
        })
    },
    init() {
        this.initHtml();
        this.initEvent();
    }
}

App.init();