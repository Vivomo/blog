class Table {
    constructor(elem) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
    }
    create(col, row) {
        this.col = col;
        this.row = row;
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
        this.trs = table.children;
        this.wrapElem.appendChild(table);
        this.initTable();
    }

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

    setText(text, col, row) {
        this.getTd(col, row).innerText = text;
    }

    getTd(col, row) {
        return this.trs[row].children[col];
    }

    /**
     * 合并单元格
     * @param from  [col, row]
     * @param to    [col, row]
     */
    mergeCell(from, to) {
        const [startCol, endCol] = [from[0], to[0]].sort();
        const [startRow, endRow] = [from[1], to[1]].sort();
        const startTd = this.getTd(startCol, startRow);

        const colSpanCount = endCol - startCol + 1;
        const rowSpanCount = endRow - startRow + 1;

        let tdContent = '';
        let removeTdList = [];


        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                let willRemovedTd = this.getTd(j, i);
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

        setTimeout(function () {
            removeTdList.forEach(item => item.remove());
        },1);

    }

    /**
     * 给table 绑定一些事件
     */
    initTable() {
        this.table.classList.add('edit-table');

        // 双击编辑
        this.table.addEventListener('dblclick', function (e) {
            const target = e.target;
            if (target.tagName === 'TD') {
                const text = target.innerText;
                const tdWidth = target.clientWidth;
                const tdHeight = target.clientHeight;

                target.innerHTML = `<textarea style="width: ${tdWidth}px; height: ${tdHeight}px">${text}</textarea>`;
                const input = target.querySelector('textarea');
                input.focus();
                input.onblur = function () {
                    target.innerText = this.value;
                }
            }
        });

        this.table.addEventListener('mousedown', function (e) {
            const target = e.target;
            if (target.tagName === 'TD') {

            }
        });
    }

}

let table = new Table('#table-wrap');
table.create(15, 30);

table.setText(123, 3, 3);
table.setText(1232344, 4, 9);