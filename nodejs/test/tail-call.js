"use strict";


let factorial = (n) => {
    if (n === 1) return 1;
    return n * factorial(n - 1);
};

// console.log(factorial(100000)); maximum

let factorial2 = (n, total = 1) => {
    if (n === 1) return total;
    return factorial2(n - 1, n * total);
}


console.log(factorial2(100000));
