let max = Math.pow(2, 20);
let a3 = [2, 5, 1, 3];
for (let i = 0; i < max; i++) {
    let answers = new Array(10).fill(null).map((item, index) => (i >> (index * 2)) % 4);
    // 2.第五题的答案是
    if ([2, 3, 0, 1][answers[1]] !== answers[4]) {
        continue;
    }
    // 3. 3, 6, 2, 4 不同的一个
    if(!a3.some((item, index) => answers[2] === index && a3.filter((item, _index) => _index !== index).every(answerIndex => answers[answerIndex] !== answers[item]))) {
        continue;
    }
    // 4. [1,5] [2,7] [1,9] [6,10] 两题相同的是
    if( ![[0, 4], [1, 6], [0, 8], [5, 9]].some((item, index) => answers[item[0]] === answers[item[1]] && answers[3] === index)) {
        continue;
    }
    // 5. 8 4 9 7, 那个和5相同
    if (![7, 3, 8, 6].some((ansIndex, index) => answers[ansIndex] === answers[4] && answers[4] === index)) {
        continue;
    }
    // 6. [2, 4] [1, 6] [3, 10] [5, 9] 和 8同
    if (![[1, 3], [0, 4], [2, 9], [4, 8]].some((item, index) => answers[item[0]] === answers[item[1]] && answers[item[1]] === answers[7] && answers[5] === index)) {
        continue;
    }
    // 7. c b a d 哪个最少?
    let count = new Array(4).fill(0);
    answers.forEach((answer) => {
        count[answer] ++;
    });
    let tempCount = [...count].sort();
    if ([2, 1, 0, 3][count.indexOf(tempCount[0])] !== answers[6]) {
        continue;
    }
    // 8. 7 5 2 10 哪个和1不相邻
    if ([6, 4, 1, 9].every((item, index) => Math.abs(answers[item] - answers[0]) === 1 && answers[7] === index)) {
        continue;
    }
    // 9. 1 === 6 !== X === 5, x 是 [6, 10, 2, 9] ?
    if (![5, 9, 1, 8].some((ansIndex, index) => (answers[0] === answers[5]) !== (answers[ansIndex] === answers[4]) && answers[8] === index)) {
        continue;
    }
    // 10. abcd 字母出现最多与最少的差是? 3 2 4 1
    if ([3, 2, 4, 1][answers[9]] === tempCount[3] - tempCount[0]) {
        console.log('answers', answers.map((answers, index) => (index + 1) + String.fromCharCode(65 + answers)));
        break;
    }
}
