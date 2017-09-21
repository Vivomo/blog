class SimpleExcel {
    constructor({elem, col, row}) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
        this.col = col;
        this.row = row;
        this.init();
    }
    init() {
        this._createTable();
        this._initColRowIndex();
        this._initWrapElem();
        this._bindTableEvent();
        this._initTableSelect();
        this._updateCellsPosition();
    }

    /**
     * 创建表格
     * @private
     */
    _createTable() {
        const {col, row} = this;
        const table = this.table = document.createElement('table');
        table.className = 'edit-table';
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
    }


    /**
     * 设置单元格文本
     */
    setText(...args) {
        let cell;
        if (args.length === 3) {
            cell = this.getCell(args[1], args[2]);
        } else if (args.length === 2) {
            cell = args[1];
        }
        cell.innerHTML = args[0];
    }

    /**
     * 设置缓存属性 data是最后一个参数, 其前面有一个参数则为cell 有两个则为col, row
     */
    setData(...args) {
        let cell;
        let data;
        if (args.length === 2) {
            cell = args[0];
            data = args[1];
        } else if (args.length === 3) {
            const col = args[0];
            const row = args[1];
            cell = this.getCell(col, row);
            data = args[2];
        }
        cell.dataset._cache = JSON.stringify(data);
    }

    /**
     * 清空数据
     * @param args 有一个参数就是cell, 两个就是col, row
     */
    clearData(...args) {
        let cell;
        if (args.length === 1) {
            cell = args[0];
        } else if (args.length === 2) {
            const col = args[0];
            const row = args[1];
            cell = this.getCell(col, row);
        }
        delete cell.dataset._cache;
    }

    /**
     * 获取对应坐标的TD
     * @param col
     * @param row
     * @returns {HTMLElement}
     */
    getCell(col, row) {
        return this.table.querySelector(`[data-col="${col}"][data-row="${row}"]`);
    }

    /**
     * 获取一个单元格的位置
     * @param cell
     * @private
     */
    _getCellPosition(cell) {
        const cellBCR = cell.getBoundingClientRect();
        return {
            top: cell.offsetTop,
            bottom: this.wrapBCR.bottom - cellBCR.bottom,
            left: cell.offsetLeft,
            right: this.wrapBCR.right - cellBCR.right,
        };
    }

    /**
     * 合并单元格
     * @param from  {col, row}
     * @param to    {col, row}
     */
    mergeCell(from, to) {
        const [startCol, endCol] = [from.col, to.col].sort(numSort);
        const [startRow, endRow] = [from.row, to.row].sort(numSort);
        const startTd = this.getCell(startCol, startRow);

        const colSpanCount = endCol - startCol + 1;
        const rowSpanCount = endRow - startRow + 1;

        let tdContent = '';
        const removeTdList = [];


        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const cell = this.getCell(j, i);
                if (cell) {
                    if (!tdContent) {
                        tdContent = cell.innerText;
                    }
                    removeTdList.push(cell);
                }
            }
        }

        removeTdList.shift();

        startTd.colSpan = colSpanCount;
        startTd.rowSpan = rowSpanCount;

        this.setText(tdContent, startCol, startRow);


        setTimeout(() => {
            removeTdList.forEach(item => item.remove());

            const startTdPosition = this._getCellPosition(startTd);
            removeTdList.forEach((item) => {
                const {col, row} = item.dataset;
                this.cellsPosition[row][col] = startTdPosition;
            });
        }, 1);
    }

    /**
     * 合并选择的单元格
     */
    mergeSelectedCell() {
        const from = JSON.parse(this.tableSelect.dataset.from);
        const to = JSON.parse(this.tableSelect.dataset.to);
        this.mergeCell(from, to);
    }

    /**
     * 选择区域
     */
    select(startPoint, endPoint = startPoint) {
        const [startCol, endCol] = [startPoint.col, endPoint.col].sort(numSort);
        const [startRow, endRow] = [startPoint.row, endPoint.row].sort(numSort);
        const from = {
            col: startCol,
            row: startRow
        };
        const to = {
            col: endCol,
            row: endRow
        };

        const leftTopCellPosition = this.cellsPosition[startRow][startCol];
        let {top, bottom, left, right} = leftTopCellPosition;

        // TODO 优化
        for (let i = endCol; i >= startCol; i--) {
            const topPosition = this.cellsPosition[startRow][i];
            if (topPosition.top < top) {
                top = topPosition.top;
                from.col = topPosition.col;
            }
            const bottomPosition = this.cellsPosition[endRow][i];
            if (bottomPosition.bottom < bottom) {
                bottom = bottomPosition.bottom;
                to.col = bottomPosition.col;
            }
        }

        for (let i = endRow; i >= startRow; i--) {
            const leftPosition = this.cellsPosition[i][startCol];
            if (leftPosition.left < left) {
                left = leftPosition.left;
                from.row = leftPosition.row;
            }
            const rightPosition = this.cellsPosition[i][endCol];
            if (rightPosition.right < right) {
                right = rightPosition.right;
                to.row = rightPosition.row;
            }
        }

        this._setTableSelect({
            top,
            bottom,
            left,
            right,
            from,
            to
        });
    }

    static isSameRect([from1, to1], [from2, to2]) {
        return from1.col === from2.col && from1.row === from2.row &&
            to1.col === to2.col && to1.row === to2.row;
    }

    /**
     * 初始化单元格坐标
     * @private
     */
    _updateCellsPosition() {
        const tempPosition = new Array(this.row + 1).fill(null).map(() => new Array(this.col + 1).fill(null));
        this.trs.forEach((tr) => {
            Array.from(tr.children).forEach((cell) => {
                const col = ~~cell.dataset.col;
                const row = ~~cell.dataset.row;

                const cellPosition = this._getCellPosition(cell);
                cellPosition.col = col;
                cellPosition.row = row;

                const colSpan = ~~cell.colSpan;
                const rowSpan = ~~cell.rowSpan;

                for (let _row = 0; _row < rowSpan; _row++) {
                    for (let _col = 0; _col < colSpan; _col++) {
                        tempPosition[row + _row][col + _col] = cellPosition;
                    }
                }
            });
        });

        this.cellsPosition = tempPosition;
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
     * @param config
     * @private
     */
    _setTableSelect(config) {
        const {left, right, top, bottom} = config;
        this.tableSelect.style.left = `${left}px`;
        this.tableSelect.style.right = `${right}px`;
        this.tableSelect.style.top = `${top}px`;
        this.tableSelect.style.bottom = `${bottom}px`;

        this.tableSelect.dataset.from = JSON.stringify(config.from);
        this.tableSelect.dataset.to = JSON.stringify(config.to);
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
        this.wrapElem.style.width = `${41 + this.col * 120}px`;
        this.wrapBCR = this.wrapElem.getBoundingClientRect().toJSON();
        window.addEventListener('scroll', () => {
            this.wrapBCR = this.wrapElem.getBoundingClientRect().toJSON();
        });
    }
    /**
     * 给table 绑定一些事件
     */
    _bindTableEvent() {
        const table = this.table;
        this.trs = Array.from(table.children);


        // 双击编辑
        this.table.addEventListener('dblclick', (e) => {
            const target = e.target;
            if (target.tagName === 'TD') {
                const text = target.innerText;
                const tdWidth = target.clientWidth;
                const tdHeight = target.clientHeight;

                target.innerHTML = `<textarea style="width: ${tdWidth}px; height: ${tdHeight}px">${text}</textarea>`;
                const input = target.querySelector('textarea');
                input.focus();
                input.onblur = () => {
                    this.clearData(target);
                    target.innerText = input.value;
                };
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
                };
            }
        });

        this.table.addEventListener('mouseup', () => {
            this.table.onmousemove = null;
        });
    }

    getContent() {
        const div = document.createElement('div');
        div.innerHTML = this.table.outerHTML;
        Array.from(div.querySelectorAll('.tr-col-index')).forEach(elem => elem.remove());
        Array.from(div.querySelectorAll('.td-row-index')).forEach(elem => elem.remove());
        return div.innerHTML;
    }
}

function numSort(a, b) {
    return a - b;
}

let table = new SimpleExcel({
    elem: '#table-wrap',
    col: 5,
    row: 5
});

document.getElementById('merge').addEventListener('click', () => {
    table.mergeSelectedCell();
});
// table.setText(123, 3, 3);
// table.setText(1232344, 4, 9);