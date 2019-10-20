const delay = (t, v) => {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, v), t)
    })
};

Promise.prototype.delay = function(t) {
    return this.then(function(v) {
        return delay(t, v);
    });
};

let creator = {
    box: document.getElementById('main-box'),
    changeInfo: document.getElementById('change'),
    noChangeInfo: document.getElementById('no-change'),
    carIndex: null,
    selectedIndex: null,
    doors: null,
    total: 0,
    changeScore: 0,
    noChangeScore: 0,
    template: `<ul class="door-box"><li class="door"></li><li class="door"></li><li class="door"></li></ul>`,
    createRandomIndex() {
        return ~~(Math.random() * 3);
    },
    create() {
        this.box.innerHTML = this.template;
        this.carIndex = this.createRandomIndex();
        this.selectedIndex = this.createRandomIndex();

        let doors = this.doors = this.box.querySelectorAll('.door');
        doors[this.carIndex].classList.add('car');
        doors[this.selectedIndex].classList.add('selected');
        this.total++;
    },
    openNoCarDoor() {
        let openIndex;
        do {
            openIndex = this.createRandomIndex()
        } while (openIndex === this.carIndex || openIndex === this.selectedIndex)
        this.doors[openIndex].classList.add('open');
    },
    count() {
        if (this.selectedIndex !== this.carIndex) {
            this.changeScore++;
        }
        if (this.selectedIndex === this.carIndex) {
            this.noChangeScore++;
        }
        this.changeInfo.innerText = `${this.changeScore}/${this.total}=${this.changeScore && (this.changeScore / this.total)}`;
        this.noChangeInfo.innerText = `${this.noChangeScore}/${this.total}=${this.noChangeScore && (this.noChangeScore / this.total)}`;
    },
    clear() {
        this.box.firstChild.remove()
    },
    start() {
        setInterval(() => {
            delay(100).then(() => {
                this.create();
            }).delay(100).then(() => {
                this.openNoCarDoor();
            }).delay(100).then(() => {
                this.count();
            }).delay(100).then(() => {
                this.clear();
            });
        }, 500);
    }
};

creator.start();