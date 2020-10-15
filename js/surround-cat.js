
let App = {
    wrap: document.getElementById('wrap'),
    init() {
        let col = 11;
        let row = 11;
        let html = new Array(row).fill(0).map(_ => {
            let items = '<div class="point"></div>'.repeat(col);
            return `<div class="row">${items}</div>`;
        }).join('');
        this.wrap.innerHTML = html + '<div class="cat"></div>';
    }
};

App.init();