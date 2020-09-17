/**
 * 字节压缩 [0, 1, 0, 0, 1, 1, 1, 1] => [0b01001111]
 * @param arr
 * @returns {[]}
 */
const compress = (arr) => {
    let result = [];
    let temp = 0;
    arr.forEach((item, index) => {
        temp += item << (7 - index % 8);
        if (index % 8 === 7) {
            result.push(temp);
            temp = 0;
        }
    });
    return result;
};

/**
 *
 * @param arr 原帧
 * @returns
 */
let RLE = (arr) => {
    let current = arr[0] >> 7;
    let result = [current];
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 7; j >= 0; j--) {
            if (((arr[i] >> j) & 1) === current) {
                count++;
            } else {
                result.push(count);
                current = current ? 0 : 1;
                count = 1;
            }
        }
    }

    result.push(count || 1);
    return result;
};

module.exports = {
    compress,
    RLE
};