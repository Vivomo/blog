class Table {
    constructor(elem) {
        this.wrapElem = typeof elem === 'string' ? document.querySelector(elem) : elem;
    }
    create(row = 1, col = 1) {
        this.row = row;
        this.col = col;
        const table = this.table = document.createElement('table');
        table.contenteditable = true;
        for (let i = 0; i < row; i++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j < col; j++) {
                tr.appendChild(document.createElement('td'));
            }
        }
        this.wrapElem.appendChild(table);
        this.initTable();
    }

    setText(text, row, col) {
        this.getTd(row, col).innerText = text;
    }

    getTd(row, col) {
        return this.table.querySelectorAll('tr')[row].querySelectorAll('td')[col];
    }

    initTable() {
        this.table.addEventListener('dblclick', function (e) {
            const target = e.target;
            if (target.tagName === 'TD') {
                const text = target.innerText;
                target.innerHTML = `<textarea>${text}</textarea>`;
                const input = target.querySelector('textarea');
                input.focus();
                input.onblur = function () {
                    target.innerText = this.value;
                }
            }
        })
    }

}

let table = new Table('#table-wrap');
table.create(5, 5);

table.setText(123, 3, 3);