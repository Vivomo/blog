
function isPrime(num){
    for (let i = 2; i < num; i++) {
        if (num % 2 === 0)
            return true;
    }
    return false;
}

console.time('f1');
let primeArr = [2, 3, 5];
for (let i = 7; i < 10000; i++) {
    isPrime(i) && primeArr.push(i);
}
console.log(primeArr.length);
console.timeEnd('f1');

