class Table {
    constructor(elem) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
    }
    create(row, col) {
        this.row = row;
        this.col = col;
        const table = this.table = document.createElement('table');
        for (let i = 0; i <= row; i++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j <= col; j++) {
                tr.appendChild(document.createElement('td'));
            }
        }
        this._setColRowIndex();
        this.wrapElem.appendChild(table);
        this.initTable();
    }

    _setColRowIndex() {
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

    setText(text, row, col) {
        this.getTd(row, col).innerText = text;
    }

    getTd(row, col) {
        return this.table.querySelectorAll('tr')[row].querySelectorAll('td')[col];
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
table.create(5, 5);

table.setText(123, 3, 3);