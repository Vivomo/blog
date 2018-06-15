// 八皇后算法
const queensNum = 8;
const max = 63;
let queens = [0];
let count = 0;
let resultCount = 0;
console.time('queen');
while (true) {
    count ++;
    let last = queens[queens.length - 1]
    if (valid(queens)) {
        if (queens.length === queensNum) {
            console.log('result', queens, count, ++resultCount)
            if (resultCount === 92) {
                console.log('All result have be found');
                console.timeEnd('queen');
                break;
            }
        } else {
            if (last !== max) {
                queens.push(last + 1);
                continue;
            }
        }
    }
    if (last === max) {
        queens.pop()
    }
    queens[queens.length - 1]++;
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

