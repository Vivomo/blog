// 八皇后算法

const queensNum = 8;
const max = 63;
let queens = [0];
let end = 0;

let maxCount = 4426165368; // 64C8
let count = 0;

while (count < maxCount) {
    count ++;
    let last = queens[queens.length - 1]
    if (valid(queens)) {
        if (queens.length === queensNum) {
            console.log('result', queens, count)
            break;
        } else {
            queens.push(last + 1);
        }
    } else {
        if (last === max) {
            queens.pop()
        }
        queens[queens.length - 1]++;
    }
}



function valid(queens) {
    let cache = {
        x: {},
        y: {},
        skew1: {},
        skew2: {},
    };

    return queens.every((queen) => {
        let x = queen % 8;
        if (cache.x[x]) {
            return false
        } else {
            cache.x[x] = true
        }

        let y = ~~ (queen / 8);
        if (cache.y[y]) {
            return false
        } else {
            cache.y[y] = true
        }

        let skew1 = y - x;
        if (cache.skew1[skew1]) {
            return false
        } else {
            cache.skew1[skew1] = true
        }

        let skew2 = y + x;
        if (cache.skew2[skew2]) {
            return false
        } else {
            cache.skew2[skew2] = true
        }
        return true
    });
}

let ans = [3, 14, 18, 31, 33, 44, 48, 61]
let ans2 = [3, 14, 18, 31, 33, 44, 48, 62]

