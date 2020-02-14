// 八皇后算法
const queensNum = 8;
const max = 63;
let queens = [0];
let count = 0;
let resultCount = 0;
console.time('queen');
while (queens[0] < 8) {
    count ++;
    let last = queens[queens.length - 1]
    if (valid(queens)) {
        if (queens.length === queensNum) {
            console.log('result', queens, count, ++resultCount)
        } else {
            if (~~(last / 8) < 7) {
                queens.push((~~(last / 8) + 1) * 8);
                continue;
            }
        }
    }
    if (last === max ||
        (queens.length > 1 && 
            (~~(last / 8) - ~~(queens[queens.length - 2] / 8) > 1))
            ) {
        queens.pop()
    }
    queens[queens.length - 1]++;
}
console.log('第一行已经试完了, 后面的不可能有解了, 解法个数', resultCount);
console.log('查找次数', count);
console.timeEnd('queen');


function valid(queens) {
    let cache = {
        x: {},
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

