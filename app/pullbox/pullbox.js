let App = {
    type: 'wall',
    initHtml() {
        document.querySelector('table').innerHTML = new Array(18).fill(null).map((tr, trIndex) => {
            let tdHtml = new Array(18).fill(null)
                        .map((td, tdIndex) => `<td data-r="${trIndex}" data-c="${tdIndex}"></td>`).join('')
            return `<tr>${tdHtml}</tr>`;
        }).join('');
    },
    initEvent() {
        let table = document.querySelector('table');

        Array.from(document.querySelectorAll('label')).forEach((label) => {
            label.addEventListener('click', () => {
                this.type = document.querySelector('input:checked').value;
            });
        });
        table.addEventListener('click', (e) => {
            let td = e.target;
            if (td.classList.contains(this.type)) {
                td.classList.remove(this.type);
                return;

            }
            switch(this.type) {
                case 'person':
                    let person = document.querySelector('.person');
                    if (person) {
                        person.className = '';
                    }
                    td.className = this.type;
                    this.person = td;
                    break;
                case 'target':
                    if (td.className === 'box') {
                        td.classList.add(this.type);
                    } else {
                        td.className = this.type;
                    }
                    break;
                case 'box':
                    if (td.className === 'box') {
                        td.classList.add(this.type);
                    } else {
                        td.className = this.type;
                    }
                    break;
                case 'wall':
                    td.className = this.type;
            }
        });
    },
    init() {
        this.initHtml();
        this.initEvent();
    }
};

App.init();