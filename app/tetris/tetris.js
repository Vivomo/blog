class BaseCeil {
    constructor() {
        this.core = document.createElement('div');
        this.core.classList.add('core-ceil');
        this.rotateState = 0;
        this.ininH = 5;
    }

    setChild(index, h, v) {
        this.children[index].style.transform = `translate( ${h * 100}%, ${v * 100}%)`;
    }

    rotate(direction = 1) {
        this.rotateState = (this.rotateState + direction) % this.loopCount;
        this.render();
    }

}

class I extends BaseCeil {
    constructor() {
        super();
        this.core.innerHTML = `
            <div class="i1"></div>
            <div class="i2"></div>
            <div class="i3"></div>
        `;
        this.children = [...this.core.children];
        this.loopCount = 2;
        this.initV = -3;
        this.h = this.ininH;
        this.v = this.initV;
    }

    
    render() {
        this.core.style.transform = `translate( ${this.h * 30}px, ${this.v * 30}px)`;

        switch(this.rotateState) {
            case 0:
                this.setChild(0, 0, -1);
                this.setChild(1, 0, 1);
                this.setChild(2, 0, 2);
                break;
            default:
                this.setChild(0, -1, 0);
                this.setChild(1, 1, 0);
                this.setChild(2, 2, 0);    
        }
    }

    tryDrop(cb) {
        this.v++;
        this.render();
    }    


    init() {
        this.render();
    }

}

class Tetris {
    constructor() {
        this.curCeil = null;
        this.nextCeil = null;
        this.ground = document.querySelector('.ground');
    }

    createCeil() {

    }

    appendNewCeil() {
        this.curCeil = new I();
        this.curCeil.init();
        this.ground.appendChild(this.curCeil.core);
    }

    next() {
        this.curCeil.v++;
        this.curCeil.render();
    }

    start() {
        this.appendNewCeil();
        setInterval(this.next.bind(this), 1000);
    }
}

let game = new Tetris();
game.start();