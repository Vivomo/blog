let {nextPermutation} = require('../util/MathUtils');
let createProduct = (cost, dayIncome) => (Object.freeze({cost, dayIncome}));
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
    createProduct(100000, 1520),
    createProduct(10000, 148),
    createProduct(5000, 72),
    createProduct(1000, 14),
    createProduct(500, 6.8),
    createProduct(100, 1.32),
    createProduct(10, 0.132),
];

let productsMap = {
    100000: createProduct(100000, 1520),
    10000: createProduct(10000, 148),
    5000: createProduct(5000, 72),
    1000: createProduct(1000, 14),
    500: createProduct(500, 6.8),
    100: createProduct(100, 1.32),
    10: createProduct(10, 0.132),
};


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

let sum = (pre, cur) => pre + cur.dayIncome;

let getIncome = (arr) => {
    let proList = [
        productsMap[10000]
    ];
    let buyIndex = 0;
    let score = 0;
    for (let i = 1; i <= 47; i++) {
        score += proList.reduce(sum, 0);
        while (score > arr[buyIndex]) {
            let pro = productsMap[arr[buyIndex]];
            proList.push(pro);
            score -= arr[buyIndex] - pro.dayIncome;
            buyIndex++;
            if (buyIndex === arr.length) {
                return {
                    score,
                    day: i
                }
            }
        }
    }
    return {};
}

let test = [100, 10, 10, 10, 10, 100, 10, 10, 10, 10, 100, 100, 500, 500, 1000, 1000, 5000];
let test2 = [100, 100, 1000, 10, 500, 500, 100, 1000, 10, 10, 10, 10, 10, 10, 10, 5000, 100];

let arr = [10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100, 500, 500, 1000, 1000, 5000];

// 172972800


let minDay = 47;
let bestScore = 0;
let bestArr = [];
console.time('a')
// 1729728
for (let index = 0; index < 17297280; index++) {
    let proList = [
        productsMap[10000]
    ];
    let buyIndex = 0;
    let score = 0;
    for (let i = 1; i <= minDay; i++) {
        score += proList.reduce(sum, 0);
        while (score > arr[buyIndex]) {
            let pro = productsMap[arr[buyIndex]];
            proList.push(pro);
            score -= arr[buyIndex] - pro.dayIncome;
            buyIndex++;
            if (buyIndex === arr.length) {
                if (i < minDay) {
                    minDay = i;
                    bestScore = score;
                    bestArr = proList
                } else if (score > bestScore) {
                    bestScore = score;
                    bestArr = proList
                }
                break;
            }
        }
    }
    nextPermutation(arr)
}

console.log(minDay, bestScore, bestArr);
console.timeEnd('a')