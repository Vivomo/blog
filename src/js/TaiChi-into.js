let App = (() => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let containerHeight = h;
    let containerWidth = Math.min(w, ~~(h * 0.618));
    let ballSize = ~~(containerWidth / 12);
    let TaiChiSize = containerWidth * 0.3;

    let TaiChi = document.querySelector('.TaiChi');
    let container = document.querySelector('#container');
    container.style.width = containerWidth + 'px';
    TaiChi.style.width = TaiChi.style.height = TaiChiSize + 'px';

    let _degree = 0;
    let dangerLine = {};
    let TaiChiInterval = 0;
    let ballInterval = 0;
    let ballDirection = 1;

    let ballState = {
        pending: 0,
        success: 1,
        fail: 2
    };

    return {
        rotateDirection: 1,
        curBall: null,
        set degree(value) {
            _degree = value;
            TaiChi.style.transform = `rotate(${_degree}deg)`;
        },
        get degree() {
            return _degree;
        },
        toggleDirection() {
            this.rotateDirection = this.rotateDirection === 1 ? -1 : 1;
            clearInterval(TaiChiInterval);
            this.rotate();
            this.updateTaiChi();
        },
        rotate() {
            this.degree += this.rotateDirection * 6;
        },
        initDangerLine() {
            let bound = TaiChi.getBoundingClientRect();
            dangerLine.top = bound.top - ballSize;
            dangerLine.bottom = bound.bottom;

        },
        /**
         *
         * @param direction
         * @returns {HTMLDivElement}
         */
        createBall(direction){
            let ball = document.createElement('div');

            if (direction === 1) {
                ball.style.top = -ballSize + 'px';
            } else {
                ball.style.top = containerHeight + 'px';
            }

            let colorClass;
            if (Math.random() < 0.5) {
                colorClass = 'black';
                ball.dataset.color = 'black';
            } else {
                colorClass = 'white';
                ball.dataset.color = 'white';
            }
            ball.className = `ball ${colorClass}`;
            return ball;
        },
        addBall() {
            ballDirection = ballDirection === 1 ? -1 : 1;
            this.curBall = this.createBall(ballDirection);
            container.appendChild(this.curBall);
        },
        moveBall() {
            let ball = this.curBall;
            let top = parseInt(ball.style.top);
            let next = top + ballDirection * 5;

            let state = this.getBallState(next);

            switch (state) {
                case ballState.success:
                    this.absorb();
                    break;
                case ballState.fail:
                    this.gameOver();
                    break;
                default:
                    ball.style.top = next + 'px';
            }


        },
        /**
         * 获取球的状态
         * state: 0 未过线 1 合理过线 2 游戏结束
         */
        getBallState(value) {
            let degree = this.getEquivalentAngle();
            let ballColor = this.curBall.dataset.color;
            if (ballDirection === 1 && value < dangerLine.top || ballDirection === -1 && value > dangerLine.bottom) {
                return ballState.pending;
            }
            if (ballDirection === 1) { // 上 -> 下
                if (degree < 180 && ballColor === 'black' || degree > 179 && ballColor === 'white') {
                    return ballState.success;
                }
            } else {
                if (degree < 180 && ballColor === 'white' || degree > 179 && ballColor === 'black') {
                    return ballState.success;
                }
            }
            return ballState.fail;
        },
        /**
         * 吸收
         */
        absorb() {
            this.curBall.remove();
            this.addBall();
            console.log('吸收')
        },
        /**
         * 获取等效角度(0-359), 方便计算
         */
        getEquivalentAngle() {
            let degree = this.degree % 360;
            return degree < 0 ? (degree + 360) : degree;
        },

        updateBall() {
            let ballTime = Date.now();
            ballInterval = setInterval(() => {
                this.moveBall();
                let now = Date.now();
                console.log('ball', now - ballTime)
                ballTime = now;
            }, 16);
        },
        updateTaiChi() {
            let TaiChiTime = Date.now();
            TaiChiInterval = setInterval(() => {
                this.rotate();
                let now = Date.now();
                console.log('TaiChi', now - TaiChiTime)
                TaiChiTime = now;
            }, 16);
        },
        gameOver(){
            alert('over');
            clearInterval(ballInterval);
            clearInterval(TaiChiInterval);
        },
        start() {
            this.initDangerLine();
            this.addBall();
            this.updateTaiChi();
            this.updateBall();
        }
    }
})();

document.body.addEventListener('click', () => {
    App.toggleDirection();
});

App.start();