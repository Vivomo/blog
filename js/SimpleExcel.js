class SimpleExcel {
    constructor({elem, col, row, tableHTML}) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
        this.wrapElem.innerHTML = '';
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
        this.getCell(...args).innerHTML = args[args.length - 1];
        this.updateTableSelectStyle();
    }

    static setText(cell, data) {
        cell.innerHTML = data;
    }

    /**
     * 设置缓存属性 data是最后一个参数, 其前面有一个参数则为cell 有两个则为col, row
     */
    setData(...args) {
        this.getCell(...args).dataset._cache = JSON.stringify(args[args.length - 1]);
    }

    /**
     * 获取表格的缓存属性
     * @param args
     * @returns {*}
     */
    getData(...args) {
        return SimpleExcel.getData(this.getCell(...args));
    }

    /**
     * 设置单元格的title
     */
    setTitle(...args) {
        this.getCell(...args).title = args[args.length - 1];
    }

    /**
     * 清空单元格的title
     */
    clearTitle(...args) {
        this.getCell(...args).title = '';
    }


    /**
     * 获取表格缓存属性
     * @returns {*}
     */
    static getData(...args) {
        const data = this.getCell(...args).dataset._cache;
        return data ? JSON.parse(data) : data;
    }

    /**
     * 清空数据
     * @param args 有一个参数就是cell, 两个就是col, row
     */
    clearData(...args) {
        delete this.getCell(...args).dataset._cache;
    }

    /**
     * 删除单元格的标题, 数据, 文本
     * @param args
     */
    clearCell(...args) {
        const cell = this.getCell(...args);
        this.clearData(cell);
        this.clearTitle(cell);
        cell.innerHTML = '';
    }

    /**
     * 获取对应坐标的TD
     * @param col
     * @param row
     * @returns {HTMLElement}
     */
    getCell(col, row) {
        return typeof col === 'object' ? col : this.table.querySelector(`[data-col="${col}"][data-row="${row}"]`);
    }

    /**
     * 获取某一行的单元格
     * @param row
     * @returns {Array}
     */
    getCellsByRow(row) {
        return Array.from(this.table.querySelectorAll(`[data-row="${row}"]`));
    }

    /**
     * 获取某一列的单元格
     * @param col
     * @returns {Array}
     */
    getCellsByCol(col) {
        return Array.from(this.table.querySelectorAll(`[data-col="${col}"]`));
    }


    /**
     * 获取所有行, 不包含第一行标注
     * @returns [] TR Array
     */
    getRows() {
        return Array.from(this.table.querySelectorAll('tr')).filter(tr => !tr.classList.contains('tr-col-index'));
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

    /**
     * 获取单元格右侧所有的单元格
     * @param cell
     * @returns {Array}
     */
    getRightCells(cell) {
        let target = cell;
        const cells = [];
        while ((target = target.nextElementSibling)) {
            cells.push(target);
        }
        return cells;
    }

    /**
     * 删除行(已考虑merge 带来的各种情况, 交互同Microsoft Excel)
     * @param row
     */
    delRow(row) {
        this.cellsPosition[row].slice(1).forEach((position) => {
            if (position.row !== position.endRow && position.col === position.endCol) {
                if (row === position.row) {
                    if (row === this.row) {
                        return;
                    }
                    let isLast = true;
                    const nextRow = this.rows[row];
                    const willMovedCell = this.getCell(position.col, row);
                    willMovedCell.rowSpan -= 1;
                    for (let i = position.col + 1; i <= this.col; i++) {
                        const nextCell = this.getCell(i, row + 1);
                        if (nextCell) {
                            isLast = false;
                            nextRow.insertBefore(willMovedCell, nextCell)
                            break;
                        }
                    }
                    if (isLast) {
                        nextRow.appendChild(willMovedCell);
                    }
                } else {
                    const cell = this.getCell(position.col, position.row);
                    cell.rowSpan -= 1;
                }
            }
        });

        this.row -= 1;
        this.rows[row - 1].remove();
        this.rows = this.getRows();
        this.rows.forEach((row, index) => {
            row.firstElementChild.innerHTML = index + 1;
        });
        this._updateDataRow();
        this._updateCellsPosition();
        this._hideTableSelect();
    }

    /**
     * 更新单元格的col row
     * @private
     */
    _updateDataRow() {
        this.rows.forEach((row, rowIndex) => {
            Array.from(row.children).slice(1).forEach((cell) => {
                cell.dataset.row = rowIndex + 1;
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
     * 获取选中的表格
     */
    getSelectedCells() {
        let {from, to} = this.tableSelect.dataset;
        const cells = [];
        if (from) {
            from = JSON.parse(from);
            to = JSON.parse(to);
            const fromCol = Number(from.col);
            const fromRow = Number(from.row);
            const toCol = Number(to.col);
            const toRow = Number(to.row);
            for (let col = fromCol; col <= toCol; col++) {
                for (let row = fromRow; row <= toRow; row++) {
                    cells.push(this.getCell(col, row))
                }
            }
        }
        return cells.filter(cell => cell);
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


        const leftTopCellPosition = this.cellsPosition[startRow][startCol];
        let {top, bottom, left, right} = leftTopCellPosition;

        let _startCol = startCol;
        let _startRow = startRow;
        let _endCol = endCol;
        let _endRow = endRow;

        for (let i = endCol; i >= startCol; i--) {
            const topPosition = this.cellsPosition[startRow][i];
            if (topPosition.row < _startRow) {
                _startRow = topPosition.row;
            }
            const bottomPosition = this.cellsPosition[endRow][i];
            if (bottomPosition.endRow > _endRow) {
                _endRow = bottomPosition.endRow;
            }
        }


        for (let i = endRow; i >= startRow; i--) {
            const leftPosition = this.cellsPosition[i][startCol];
            if (leftPosition.col < _startCol) {
                _startCol = leftPosition.col;
            }
            const rightPosition = this.cellsPosition[i][endCol];
            if (rightPosition.endCol > _endCol) {
                _endCol = rightPosition.endCol;
            }
        }
        if (startCol !== _startCol || _startRow !== startRow || endCol !== _endCol || endRow !== _endRow) {
            this.select({
                col: _startCol,
                row: _startRow
            }, {
                col: _endCol,
                row: _endRow
            });
            return;
        } else {
            const startPosition = this.cellsPosition[startRow][startCol];
            const endPosition = this.cellsPosition[endRow][endCol];
            top = startPosition.top;
            left = startPosition.left;
            bottom = endPosition.bottom;
            right = endPosition.right;
        }

        const from = {
            col: startCol,
            row: startRow
        };
        const to = {
            col: endCol,
            row: endRow
        };

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
        this.wrapBCR = SimpleExcel.getElemPlainRect(this.wrapElem);
        const tempPosition = new Array(this.row + 1).fill(null).map(() => new Array(this.col + 1).fill(null));
        this.rows.forEach((tr) => {
            Array.from(tr.children).forEach((cell) => {
                const col = ~~cell.dataset.col;
                const row = ~~cell.dataset.row;

                const cellPosition = this._getCellPosition(cell);
                const colSpan = ~~cell.colSpan;
                const rowSpan = ~~cell.rowSpan;

                cellPosition.col = col;
                cellPosition.row = row;
                cellPosition.endCol = col - 1 + colSpan;
                cellPosition.endRow = row - 1 + rowSpan;

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
        this.wrapBCR = SimpleExcel.getElemPlainRect(this.wrapElem);
        let intervalMark;
        window.addEventListener('scroll', () => {
            clearTimeout(intervalMark);
            intervalMark = setTimeout(() => {
                this.wrapBCR = SimpleExcel.getElemPlainRect(this.wrapElem);
            }, 300);
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
                if (target.classList.contains('td-row-index')) {
                    return false;
                }
                if (target.parentNode.classList.contains('tr-col-index')) {
                    return false;
                }
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

    /**
     * 提高兼容性, 此方法等同于 elem.getBoundingClientReact().toJSON(); 但兼容性太差, 需要chrome61及以上才支持
     * @param elem
     * @returns {{bottom: Number, height: Number, left: Number, right: Number, top: Number, width: Number, x, y}}
     */
    static getElemPlainRect(elem) {
        const rect = elem.getBoundingClientRect();
        return {
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
            x: rect.x,
            y: rect.y
        }
    }
}

function numSort(a, b) {
    return a - b;
}

let table = new SimpleExcel({
    elem: '#table-wrap',
    col: 3,
    row: 3
});

document.getElementById('merge').addEventListener('click', () => {
    table.mergeSelectedCell();
});
// table.setText(123, 3, 3);
// table.setText(1232344, 4, 9);