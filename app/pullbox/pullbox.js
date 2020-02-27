let App = {
    type: 'wall',
    initEvent() {
        Array.from(document.querySelectorAll('label')).forEach((label) => {
            label.addEventListener('click', () => {
                this.type = document.querySelector('input:checked').value;
            });
        });
        document.querySelector('table').addEventListener('click', (e) => {
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
        this.initEvent();
    }
};

App.init();