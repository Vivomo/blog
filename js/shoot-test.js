class ShootTest{

    constructor(config) {
        this.screen = config.screen;
        this.width = this.screen.clientWidth;
        this.height = this.screen.clientHeight;
        this.initScreen();

    }

    initScreen() {
        this.screen.addEventListener('click', ({target}) => {

            if (target.classList.contains('target')) {
                target.remove()
            } else {

            }
        });
    }

    createTarget() {
        let target = document.createElement('div');
        target.style.left = `${~~ (this.width * Math.random())}px`
        target.style.top = `${~~ (this.height * Math.random())}px`
        this.screen.appendChild(target);
        target.className = 'target'
    }
}