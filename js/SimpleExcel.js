class SimpleExcel {
    constructor({elem, col, row, tableHTML}) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
        this.col = col;
        this.row = row;
        this.tableHTML = tableHTML;
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
        if (this.tableHTML) {
            const tempWrap = document.createElement('div');
            tempWrap.innerHTML = this.tableHTML;
            this.table = tempWrap.firstElementChild;
            this.row = this.table.querySelectorAll('tr').length;
            let col = 0;
            Array.from(this.table.querySelector('tr').querySelectorAll('td')).forEach(td => {
                col += Number(td.colSpan);
            });
            this.col = col;
        } else {
            const {col, row} = this;
            const table = this.table = document.createElement('table');
            table.className = 'edit-table';
            for (let i = 1; i <= row; i++) {
                const tr = document.createElement('tr');
                table.appendChild(tr);
                for (let j = 1; j <= col; j++) {
                    const td = document.createElement('td');
                    td.dataset.col = j;
                    td.dataset.row = i;
                    tr.appendChild(td);
                }
            }
        }
    }


    /**
     * 设置单元格文本
     */
    setText(...args) {
        let cell;
        let data;
        if (args.length === 3) {
            cell = this.getCell(args[0], args[1]);
            data = args[2];
        } else if (args.length === 2) {
            cell = args[0];
            data = args[1];
        }
        cell.innerHTML = data;
        this.updateTableSelectStyle();
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
     * 获取表格的缓存属性
     * @param args
     * @returns {*}
     */
    getData(...args) {
        const cell = args.length === 1 ? args[0] : this.getCell(args[0], args[1]);
        const data = SimpleExcel.getData(cell);
        return data ? JSON.parse(data) : data;
    }

    /**
     * 获取表格缓存属性
     * @param cell
     * @returns {*}
     */
    static getData(cell) {
        return cell.dataset._cache;
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
     * 获取所有行, 不包含第一行标注
     * @returns {HTMLElement} TR Array
     */
    getRows() {
        return Array.from(this.table.children).filter(tr => !tr.classList.contains('tr-col-index'));
    }

    /**
     * 获取单元格的左边的单元格, 没有或不是内容单元格则返回null
     * @param cell
     * @returns {*}
     */
    getLeftCell(cell) {
        const {col, row} = cell.dataset;
        return this.getCell(col - 1, row);
    }

    getRightCell(cell) {
        const {col, row} = cell.dataset;
        return this.getCell(Number(col) + 1, row);
    }

    getTopCell(cell) {
        const {col, row} = cell.dataset;
        return this.getCell(col, row - 1);
    }

    getBottomCell(cell) {
        const {col, row} = cell.dataset;
        return this.getCell(col, Number(row) + 1);
    }

    getRightCells(cell) {
        let target = cell;
        const cells = [];
        while ((target = target.nextElementSibling)) {
            cells.push(target);
        }
        return cells;
    }

    /**
     * 删除行 (暂时未考虑merge cell带来的问题)
     * TODO 兼容 merge cell
     * @param row
     */
    delRow(row) {
        this.row -= 1;
        this.rows[row - 1].remove();
        this.rows = this.getRows();
        this.rows.forEach((row, index) => {
            row.firstElementChild.innerHTML = index + 1;
        });
        this._updateColRow();
        this._updateCellsPosition();
        this._hideTableSelect();
    }

    /**
     * 更新单元格的col row
     * @private
     */
    _updateColRow() {
        this.rows.slice(1).forEach((row, rowIndex) => {
            Array.from(row.children).slice(1).forEach((cell, colIndex) => {
                cell.dataset.row = rowIndex + 1;
                cell.dataset.col = colIndex + 1;
            })
        });
    }


    /**
     * 获取选中的表格,选中多个则返回左上角的那个
     */
    getSelectedCell() {
        const position = this.tableSelect.dataset.from;
        if (position) {
            const {col, row} = JSON.parse(position);
            return this.getCell(col, row);
        }
        return null;
    }

    /**
     * 获取所有设置了缓存属性的单元格
     * @param parentElem
     * @returns {Array}
     */
    static getAllSetDataCells(parentElem = document) {
        return Array.from(parentElem.querySelectorAll('td[data-_cache]'));
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

        this.setText(startCol, startRow, tdContent);


        setTimeout(() => {
            removeTdList.forEach(item => item.remove());

            const startTdPosition = this._getCellPosition(startTd);
            removeTdList.forEach((item) => {
                const {col, row} = item.dataset;
                this.cellsPosition[row][col] = startTdPosition;
            });
            this.updateTableSelectStyle();
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

    /**
     * 更新选框的样式
     */
    updateTableSelectStyle() {
        const {from, to} = this.tableSelect.dataset;
        if (!from) {
            return;
        }
        this._updateCellsPosition();
        this.select(JSON.parse(from), JSON.parse(to));
    }

    /**
     * 隐藏选框
     * @private
     */
    _hideTableSelect() {
        const selector = this.tableSelect;
        delete selector.dataset.from;
        delete selector.dataset.to;
        selector.style.top = selector.style.bottom = selector.style.left = selector.style.right = '-2px';
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
        this.wrapBCR = this.wrapElem.getBoundingClientRect().toJSON();
        const tempPosition = new Array(this.row + 1).fill(null).map(() => new Array(this.col + 1).fill(null));
        this.rows.forEach((tr) => {
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
        const trCol = document.createElement('tr');
        trCol.className = 'tr-col-index';
        for (let i = 0; i < this.col; i++) {
            const td = document.createElement('td');
            td.innerText = String.fromCharCode(65 + i); // 65是A
            trCol.appendChild(td);
        }
        this.table.insertBefore(trCol, this.table.firstElementChild);

        const trList = this.table.querySelectorAll('tr');
        for (let j = 0; j <= this.row; j++) {
            const td = document.createElement('td');
            td.className = 'td-row-index';
            td.innerText = j;
            trList[j].insertBefore(td, trList[j].firstElementChild);
        }
        this.table.querySelector('.td-row-index').innerHTML = '';
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
        this.rows = this.getRows();


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
                    target.innerText = input.value;
                    this.clearData(target);
                    this.updateTableSelectStyle();
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
    col: 10,
    row: 5
});

document.getElementById('merge').addEventListener('click', () => {
    table.mergeSelectedCell();
});
// table.setText(123, 3, 3);
// table.setText(1232344, 4, 9);