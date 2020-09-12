let obj = {};
let numReg = /\d+/;
$$('.tabber-item:not([data-kind="杂货"]) .table--dark-m').forEach((item) => {
    item.querySelectorAll('.item-recipe--material').forEach((line) => {
        let category = line.querySelector('.item-category').innerText.trim();
        if (category === '杂货') {
            return
        }
        let name = line.querySelector('.item-name').innerText.trim();
        let num = Number(numReg.exec(line.querySelector('.item-number').innerText)[0]);
        if (obj[name]) {
            obj[name] += num;
        } else {
            obj[name] = num;
        }
    });
});