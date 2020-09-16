/**
 *
 * @param arr 原帧
 * @returns
 */
let RLE = (arr) => {
    let current = arr[0] >> 15;
    let result = [current];
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 15; j >= 0; j--) {
            if (arr[i] >> j === current) {
                count++;
            } else {
                result.push(count);
                current = current ? 0 : 1;
                count = 0;
            }
        }
    }

    result.push(count || 1);
    return result;
};

console.log(RLE([0, 0, 0, 1]));