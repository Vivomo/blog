/**
 * 进制转换
 */

/**
 * 二进制
 * @param num
 */
function toBinary(num){
    let arr = [];
    do {
        arr.unshift(num & 1);
    } while (num >>= 1);
    return arr.join('');
}

/**
 * 八进制
 * @param num
 */
function toOctal(num) {
    let arr = [];
    do {
        arr.unshift(num & 7);
    } while (num >>= 3);
    return arr.join('');
}


console.log(toBinary(80));
console.log(toOctal(100) === (100).toString(8));