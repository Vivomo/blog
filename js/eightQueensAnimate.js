// 八皇后算法
let queens = [0];
let count = 0;
let resultCount = 0;
let mark = {
    x: [0],
    skew1: [0],
    skew2: [0]
}
let queenElem = document.querySelectorAll('.queen');


function start() {

    function run() {
        updateQueenPosition();
        requestAnimationFrame(() => {
            count ++;
            let lastIndex = queens.length - 1;
            let last = queens[lastIndex];
            let y = ~~(last / 8);
            if (valid(mark)) {
                if (queens.length === 8) {
                    console.log('result', queens, count, ++resultCount);
                    alert(`解法${resultCount}:--->${queens.join('-')},点击确定继续查找`)
                } else {
                    if (y < 7) {
                        y++;
                        let newLast = y * 8;
                        queens.push(newLast);
                        mark.x.push(0);
                        mark.skew1.push(y);
                        mark.skew2.push(y);
                        requestAnimationFrame(run)
                        return;
                    }
                }
            }
            
            if (last % 8 === 7 || 
                (queens.length > 1 && 
                    (y - ~~(queens[queens.length - 2] / 8) > 1))) {
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
            if (queens[0] < 8) {
                requestAnimationFrame(run)
            } else {
                alert(`第一行已经试完了, 后面的不可能有解了, 解法个数, ${resultCount}, 查找次数 ${count}`);
            }
        })
    }
    run();
}

function updateQueenPosition() {
    for (let i = 0; i < queens.length; i++) {
        queenElem[i].style.transform = `translate3d(${(queens[i] % 8) * 80}px, ${~~(queens[i] / 8) * 80}px, 0)`;
        queenElem[i].classList.add('show');
    }
    for (let i = queens.length; i < 8; i++) {
        queenElem[i].classList.remove('show');
    }
}


function valid(mark) {
    let index = mark.x.length - 1;
    return !(mark.x.indexOf(mark.x[index]) !== index ||
        mark.skew1.indexOf(mark.skew1[index]) !== index ||
        mark.skew2.indexOf(mark.skew2[index]) !== index); 
}


document.getElementById('start').addEventListener('click', start);
