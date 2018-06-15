// 八皇后算法
const queensNum = 8;
const max = 63;
let queens = [0];
let count = 0;
let resultCount = 0;
let queenElem = document.querySelectorAll('.queen');


function start() {

    function run() {
        updateQueenPosition();
        requestAnimationFrame(() => {
            count ++;
            let last = queens[queens.length - 1]
            if (valid(queens)) {
                if (queens.length === queensNum) {
                    console.log('result', queens, count, ++resultCount);
                    alert(`解法${resultCount}${queens.join('-')},点击确定继续查找`)
                } else {
                    if (last !== max) {
                        queens.push(last + 1);
                        requestAnimationFrame(run)
                        return;
                    }
                }
            }
            if (last === max) {
                queens.pop()
            }
            queens[queens.length - 1]++;
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
    for (let i = queens.length; i < queensNum; i++) {
        queenElem[i].classList.remove('show');
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


document.getElementById('start').addEventListener('click', start);
