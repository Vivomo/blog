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


console.log(toBinary(80));