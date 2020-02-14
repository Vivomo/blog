// 八皇后算法
let queens = [0];
let mark = {
    x: [0],
    skew1: [0],
    skew2: [0]
}
let count = 0;
let resultCount = 0;
console.time('queen');
while (queens[0] < 8) {
    count ++;
    let lastIndex = queens.length - 1;
    let last = queens[lastIndex];
    let y = ~~(last / 8);
    if (valid(mark)) {
        if (queens.length === 8) {
            console.log('result', queens, count, ++resultCount)
        } else {
            if (y < 7) {
                y++;
                let newLast = y * 8;
                queens.push(newLast);
                mark.x.push(0);
                mark.skew1.push(y);
                mark.skew2.push(y);
                continue;
            }
        }
    }
    if ( last % 8 === 7 ||
        (queens.length > 1 && 
            (y - ~~(queens[queens.length - 2] / 8) > 1))
            ) {
        queens.pop();
        mark.x.pop();
        mark.skew1.pop();
        mark.skew2.pop();
        lastIndex--;
    }
    queens[lastIndex]++;
    last = queens[lastIndex];
    let x = last % 8;
    y = ~~(last / 8);
    mark.x[lastIndex] = x;
    mark.skew1[lastIndex] = x + y;
    mark.skew2[lastIndex] = y - x;
}
console.log('第一行已经试完了, 后面的不可能有解了, 解法个数', resultCount);
console.log('查找次数', count);
console.timeEnd('queen');


function valid(mark) {
    let index = mark.x.length - 1;
    return !(mark.x.indexOf(mark.x[index]) !== index ||
        mark.skew1.indexOf(mark.skew1[index]) !== index ||
        mark.skew2.indexOf(mark.skew2[index]) !== index); 
}

