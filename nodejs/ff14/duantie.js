let obj = {};
let numReg = /\d+/;
let ignoreCategories = ['杂货', '家具', '其他', '屋顶照明', '庭具', '桌台', '桌上', '壁挂', '']
$$('.tabber-item').forEach((item) => {
    let category = item.dataset.kind || '';
    if (ignoreCategories.includes(category)) {
        return;
    }
    item.querySelectorAll('.table--dark-m .item-recipe--material').forEach((line) => {
        let name = line.querySelector('.item-name')?.innerText?.trim();
        let num = Number(numReg.exec(line.querySelector('.item-number').innerText)[0]);
        if (obj[name]) {
            obj[name] += num;
        } else {
            obj[name] = num;
        }
    })
})
$$('.tabber-item:not([data-kind="杂货"]) .table--dark-m').forEach((item) => {
    let category = item.querySelector('.item-category')?.innerText?.trim();
    if (category === '杂货' || category === '其他' || !category) {
        return
    }
    item.querySelectorAll('.item-recipe--material').forEach((line) => {
        let name = line.querySelector('.item-name')?.innerText?.trim();
        if (!name) {
            return;
        }
        let num = Number(numReg.exec(line.querySelector('.item-number').innerText)[0]);
        if (obj[name]) {
            obj[name] += num;
        } else {
            obj[name] = num;
        }
    });
});