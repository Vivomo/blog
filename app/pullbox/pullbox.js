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
            td.classList.toggle(this.type);
        });
    },
    init() {
        this.initEvent();
    }
};

App.init();