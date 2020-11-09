let App = (() => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let containerHeight = h;
    let containerWidth = Math.min(w, ~~(h * 0.618));
    let ballSize = ~~(w / 12);
    let TaiChiSize = containerWidth * 0.3;

    let TaiChi = document.querySelector('.TaiChi');
    let container = document.querySelector('#container');
    container.style.width = containerWidth + 'px';
    TaiChi.style.width = TaiChi.style.height = TaiChiSize + 'px';

    let _degree = 0;
    let dangerLine = {};
    let interval = 0;
    let ballDirection = 1;

    return {
        rotateDirection: 1,
        set degree(value) {
            _degree = value;
            TaiChi.style.transform = `rotate(${_degree}deg)`;
        },
        get degree() {
            return _degree;
        },
        toggleDirection() {
            this.rotateDirection = this.rotateDirection === 1 ? -1 : 1;
        },
        rotate() {
            this.degree += this.rotateDirection * 6;
        },
        initDangerLine() {
            let bound = TaiChi.getBoundingClientRect();
            dangerLine.top = bound.top - ballSize;
            dangerLine.bottom = bound.bottom + ballSize;

        },
        addBall() {
            let ball = document.createElement('div');
            ball.className = `ball
                                ${ballDirection === 1 ? 'from-top' : 'from-bottom'} 
                                ${Math.random() < 0.5 ? 'black' : 'white'}`;
            container.appendChild(ball);
        },
        start() {
            this.initDangerLine();
            this.addBall();
            interval = setInterval(() => {
                this.rotate();
            }, 16);
        }
    }
})();

document.body.addEventListener('click', () => {
    App.toggleDirection();
});

App.start();