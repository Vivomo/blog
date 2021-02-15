let createProduct = (cost, dayIncome, index) => (Object.freeze({cost, dayIncome, remainingPeriod: 90, index}));
let limit = {
    100000: 1,
    10000: 1,
    5000: 1,
    1000: 2,
    500: 2,
    100: 4,
    10: 8
};
let products = [
    createProduct(100000, 1520, 0),
    createProduct(10000, 148, 1),
    createProduct(5000, 72, 2),
    createProduct(1000, 14, 3),
    createProduct(500, 6.8, 4),
    createProduct(100, 1.32, 5),
    createProduct(10, 0.132, 6),
];

let getValidProducts = (elem) => {
    let index = elem.products.length ? elem.products[elem.products.length - 1].index : 0;
    let validProducts = [];
    for (let i = index; i < products.length; i++) {
        let product = products[i];
        if (product.cost <= elem.score &&
            elem.products.filter(elemProduct => product.cost === elemProduct.cost).length < limit[product.cost]) {
            validProducts.push(product);
        }
    }
    return validProducts;
}

let calcIncome = (cmb) => {
    cmb.forEach(item => {
        item.score += item.products.reduce((prev, cur) => {
            return prev + cur.dayIncome;
        }, 0)
    });
}

let getMaxScore = (day) => {
    for (let i = 0; i < day; i++) {
        calcIncome(combination);
        let loopIndex = 0;
        while (true) {
            let hasValidProducts = false;
            let tempCmb = [];
            combination.slice(loopIndex).forEach((cmbItem) => {
                let validProducts = getValidProducts(cmbItem);
                if (validProducts.length > 0) {
                    hasValidProducts = true;
                    validProducts.forEach(product => {
                        tempCmb.push({
                            score: cmbItem.score - product.cost,
                            products: [...cmbItem.products, product]
                        })
                    });
                }
            });
            calcIncome(tempCmb);
            combination = [...combination, ...tempCmb]
            // combination.push(...tempCmb);
            loopIndex = combination.length - tempCmb.length;
            if (!hasValidProducts) {
                break
            }
        }
    }

}

let root = {
    score: 10000,
    products: [],
}

let combination = [
    root
];



getMaxScore(1);
console.log(combination.length);
// let score = combination.sort((a, b) => a.score - b.score).map(item => item.score);
// console.log(score)