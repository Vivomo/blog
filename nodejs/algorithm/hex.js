/**
 * 进制转换
 */

const hexArr = '0123456789ABCDEF'.split('');
/**
 * 二进制
 * @param num
 */
function toBinary(num){
    let arr = [];
    do {
        arr.unshift(hexArr[num & 1]);
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
        arr.unshift(hexArr[num & 7]);
    } while (num >>= 3);
    return arr.join('');
}

/**
 * 十六进制
 */
function toHexadecimal(num) {
    let arr = [];
    do {
        arr.unshift(hexArr[num & 15]);
    } while (num >>= 4);
    return arr.join('')
}


console.log(toBinary(80));
console.log(toOctal(100) === (100).toString(8));
console.log(toHexadecimal(100) === (100).toString(16));