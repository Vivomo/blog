class BaseCeil {
    constructor() {
        this.core = document.createElement('div');
        this.core.classList.add('core-ceil');
        this.rotateState = 0;
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
    }

    rotate(direction = 1) {
        this.rotateState = (this.rotateState + direction) % this.loopCount;
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

    setChild(index, h, v) {
        this.children[index].style.transform = `translate( ${h * 100}%, ${v * 100}%)`;
    }

}

class Tetris {
    constructor() {
        this.curCeil = null;
        this.nextCeil = null;
    }

    createCeil() {

    }

    start() {

    }
}