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
    carIndex: null,
    selectedIndex: null,
    doors: null,
    total: 0,
    template: `<ul class="door-box">
        <li class="door"></li>
        <li class="door"></li>
        <li class="door"></li>
    </ul>`,
    createRandomIndex() {
        return ~~(Math.random() * 3);
    },
    create() {
        this.box.innerHTML = this.template;
        this.carIndex = this.createRandomIndex();
        do {
            this.selectedIndex = this.createRandomIndex();
        } while (this.selectedIndex !== this.carIndex);
        let doors = this.doors = this.box.querySelectorAll('.door');
        doors[this.carIndex].classList.add('car');
        doors[this.selectedIndex].classList.add('selected');
    },
    openNoCarDoor() {
        let openIndex;
        do {
            openIndex = this.createRandomIndex()
        } while (openIndex !== this.carIndex && openIndex !== this.selectedIndex)
        this.doors[openIndex].classList.add('open');
    },
    count() {

    },
    clear() {
        this.box.firstChild.remove()
    },
    start() {
        delay(1000).then(() => {
            this.create();
        }).delay(1000).then(() => {
            this.openNoCarDoor();
        }).delay(1000).then(() => {
            this.count();
        });
        setInterval(() => {

        }, 400);
    }
};

creator.start();