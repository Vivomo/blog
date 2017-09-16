class Table {
    constructor(elem) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
    }
    create(row, col) {
        this.row = row;
        this.col = col;
        const table = this.table = document.createElement('table');
        table.contenteditable = true;
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
        const colIndexTd = this.table.firstElementChild.querySelectorAll('td');
        for (let i = 1; i <= this.col; i++) {
            colIndexTd[i].innerHTML = String.fromCharCode(65 + i - 1); // 65是A
        }
        const trList = this.table.querySelectorAll('tr');
        for (let j = 1; j <= this.row; j++) {
            trList[j].firstElementChild.innerHTML = j;
        }
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