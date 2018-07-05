class ShootTest{

    constructor(config) {
        this.screen = config.screen;
        this.width = this.screen.clientWidth;
        this.height = this.screen.clientHeight;
        this.diameter = config.diameter || 60;
        console.log(this)
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
        target.style.left = `${~~ ((this.width - this.diameter)  * Math.random())}px`;
        target.style.top = `${~~ ((this.height - this.diameter)  * Math.random())}px`;
        target.style.width = target.style.height = `${this.diameter}px`;
        this.screen.appendChild(target);
        target.className = 'target'
    }
}