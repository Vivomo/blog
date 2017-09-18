class Table {
    constructor(elem, col, row) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
        this.col = col;
        this.row = row;
        this.init();
    }
    init() {
        const {col, row} = this;
        const table = this.table = document.createElement('table');
        for (let i = 0; i <= row; i++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j <= col; j++) {
                const td = document.createElement('td');
                td.dataset.col = j;
                td.dataset.row = i;
                tr.appendChild(td);
            }
        }
        this._initColRowIndex();
        this._initWrapElem();
        this._initTable();
        this._initTableSelect();
        this._updateCellsPosition();
    }


    setText(text, col, row) {
        this.getCell(col, row).innerText = text;
    }

    /**
     * 获取对应坐标的TD
     * @param col
     * @param row
     * @returns {HTMLElement}
     */
    getCell(col, row) {
        return this.trs[row].children[col];
    }

    /**
     * 合并单元格
     * @param from  {col, row}
     * @param to    {col, row}
     */
    mergeCell(from, to) {
        const [startCol, endCol] = [from.col, to.col].sort();
        const [startRow, endRow] = [from.row, to.row].sort();
        const startTd = this.getCell(startCol, startRow);

        const colSpanCount = endCol - startCol + 1;
        const rowSpanCount = endRow - startRow + 1;

        let tdContent = '';
        let removeTdList = [];


        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                let willRemovedTd = this.getCell(j, i);
                if (!willRemovedTd || ~~willRemovedTd.dataset.col > endCol) {
                    break;
                } else {
                    if (!tdContent) {
                        tdContent = willRemovedTd.innerText;
                    }
                    removeTdList.push(willRemovedTd);
                }
            }
        }

        removeTdList.shift();

        startTd.colSpan = colSpanCount;
        startTd.rowSpan = rowSpanCount;

        startTd.innerHTML = tdContent;
        setTimeout(function () {
            removeTdList.forEach(item => {

                item.remove();
            });
        },1);

    }

    /**
     * 选择区域
     */
    select(startPoint, endPoint = startPoint) {

        const [startCol, endCol] = [startPoint.col, endPoint.col];
        const [startRow, endRow] = [startPoint.row, endPoint.row];

        const leftTopTdCoord = this.cellsPosition[startRow][startCol];
        let {top, bottom, left, right} = leftTopTdCoord;

        for (let i = endCol; i >= startCol; i--) {
            top = Math.min(this.cellsPosition[startRow][i].top, top);
            bottom = Math.min(this.cellsPosition[endRow][i].bottom, bottom);
        }

        for (let i = endRow; i >= startRow; i--) {
            left = Math.min(this.cellsPosition[i][startCol].left, left);
            right = Math.min(this.cellsPosition[i][endCol].right, right);
        }

        this._setTableSelect({
            top,
            bottom,
            left,
            right
        });

    }

    /**
     * 初始化单元格坐标
     * @private
     */
    _updateCellsPosition() {
        const wrapBCR = this.wrapElem.getBoundingClientRect().toJSON();

        this.cellsPosition = new Array(this.row).fill(null).map((item, index) => {
            return Array.from(this.trs[index].children).map((elem) => {
                const bcr = elem.getBoundingClientRect();
                return {
                    top: elem.offsetTop,
                    bottom: wrapBCR.bottom - bcr.bottom,
                    left: elem.offsetLeft,
                    right: wrapBCR.right - bcr.right,
                }
            })
        });
    }

    /**
     * 获取一个坐标对应单元格的行列
     * @param point
     * @private
     */
    _getCoordIndex(point) {

    }

    /**
     * 初始化选择框
     * @private
     */
    _initTableSelect() {
        const tableSelect = this.tableSelect = document.createElement('div');
        tableSelect.className = 'table-select';
        this.wrapElem.appendChild(tableSelect);
    }

    /**
     * init table select
     * @param style
     * @private
     */
    _setTableSelect(style){
        Object.entries(style).forEach(([key, value]) => {
            this.tableSelect.style[key] = `${value}px`;
        });
    }

    /**
     * init 行列标注
     * @private
     */
    _initColRowIndex() {
        const trColIndex = this.table.firstElementChild;
        trColIndex.classList.add('tr-col-index');

        const colIndexTd = trColIndex.querySelectorAll('td');
        for (let i = 1; i <= this.col; i++) {
            colIndexTd[i].innerHTML = String.fromCharCode(65 + i - 1); // 65是A
        }

        const trList = this.table.querySelectorAll('tr');
        for (let j = 1; j <= this.row; j++) {
            const tdRowIndex = trList[j].firstElementChild;
            tdRowIndex.classList.add('td-row-index');
            tdRowIndex.innerHTML = j;
        }

        const firstTd = trColIndex.firstElementChild;
        firstTd.classList.add('td-row-index');
    }

    /**
     * init wrap
     * @private
     */
    _initWrapElem() {
        this.wrapElem.appendChild(this.table);
        this.wrapElem.style.width = `${41+this.col * 60}px`;
        this.wrapBCR = this.wrapElem.getBoundingClientRect().toJSON();
    }
    /**
     * 给table 绑定一些事件
     */
    _initTable() {
        const table = this.table;
        this.trs = table.children;
        this.table.classList.add('edit-table');


        // 双击编辑
        this.table.addEventListener('dblclick', function (e) {
            const target = e.target;
            if (target.tagName === 'TD') {
                const text = target.innerText;
                const tdWidth = target.clientWidth;
                const tdHeight = target.clientHeight;

                target.innerHTML = `<textarea style="width: ${tdWidth}px; height: ${tdHeight}px">${text}</textarea>`;
                console.log(target.firstElementChild);
                const input = target.querySelector('textarea');
                input.focus();
                input.onblur = function () {
                    target.innerText = this.value;
                }
            }
        });

        this.table.addEventListener('mousedown', (e) => {
            const target = e.target;
            if (target.tagName === 'TD') {
                this._updateCellsPosition();

                const data = target.dataset;
                const startPoint = {
                    col: ~~data.col,
                    row: ~~data.row
                };
                this.select(startPoint);

                this.table.onmousemove = (e) => {
                    const target = e.target;
                    if (target.tagName === 'TD') {
                        const data = target.dataset;
                        const endPoint = {
                            col: ~~data.col,
                            row: ~~data.row
                        };
                        this.select(startPoint, endPoint);
                    }
                }

            }
        });

        this.table.addEventListener('mouseup', () => {
            this.table.onmousemove = null;
        });
    }



}

let table = new Table('#table-wrap', 15, 30);

// table.setText(123, 3, 3);
// table.setText(1232344, 4, 9);