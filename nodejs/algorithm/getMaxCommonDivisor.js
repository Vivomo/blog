/**
 * 获取最大公约数
 */


/**
 * 欧几里得算法
 * @param num1
 * @param num2
 */
function euclideanAlgorithm(num1, num2){
    let max = Math.max(num1, num2);
    let min = Math.min(num1, num2);

    while (max % min) {
        let temp = max - min;
        max = Math.max(temp, min);
        if (min === max) {
            min = temp;
        }
    }
    return min;
}

console.log(euclideanAlgorithm(7, 3));

export default euclideanAlgorithm;