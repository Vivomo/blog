// 八皇后算法

const queensNum = 8;
const max = 63;
let queens = [];
let end = 0;
for (let i = 0; i < queensNum; i++) {
    queens.push(i);
    end += max - i;
}

let maxCount = 4426165368; // 64C8
let count = 0;
let arrSum = getArraySum(queens);

while (arrSum < end) {
    for (let queenIndex = queensNum - 1; queenIndex >= 0; queenIndex--) {
        let queen = queens[queenIndex];
        let siblingQueen = queens.filter(item => item !== queen);
        for (let queenValue = queen; queenValue <= max; queenValue++) {
            if (!siblingQueen.includes(queenIndex) && valid([...siblingQueen, queen])) {
                siblingQueen.splice(queenIndex, 0, queenValue);
                console.log(siblingQueen, 'result');
            }
            count ++;
            if (count > maxCount) {
                throw 'over'
            }
        }
        if (queen < max) {
            queens[queenIndex]++
        }
    }
    console.log(queens, count)
    arrSum = getArraySum(queens);
}

console.log(count, 'count')

function getArraySum(arr) {
    return arr.reduce((a, b) => a + b, 0)
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

        let skew1 = y / x;
        if (cache.skew1[skew1]) {
            return false
        } else {
            cache.skew1[skew1] = true
        }

        let skew2 = y / (8 - x);
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

console.log(valid(ans))
console.log(valid(ans2))