let Type = {
    wall: 'wall',
    person: 'person',
    target: 'target',
    box: 'box',
};

let App = {
    type: Type.wall,
    getPersonPoint(){
        let person = document.querySelector('.person');
        if (!person) {
            return null;
        }
        let {x, y} = person.dataset;
        return {x: ~~x, y: ~~y};
    },
    nextPoint(point, direction) {
        let {x, y} = point;
        if (direction % 2 === 0) {
            x = point.x + direction - 1;
        } else {
            y = point.y + direction - 2;
        }
        return {x, y};
    },
    move(direction) {
        let point = this.getPersonPoint();
        if (!point) {
            return;
        }
        let curElem = this.getPointElem(point);
        let next = this.nextPoint(point, direction);
        let nextElem = this.getPointElem(next);
        let next2 = this.nextPoint(next, direction);
        let next2Elem = this.getPointElem(next2);

        if (!nextElem || !next2Elem || this.isWall(nextElem)) {
            return;
        }
        if (this.isBox(nextElem)) {
            if (this.isWall(next2Elem) || this.isBox(next2Elem)) {
                return;
            }
            this.moveElemTo(nextElem, next2);
        }
        this.moveElemTo(curElem, next);
    },
    moveElemTo(elem, point) {
        let nextElem = this.getPointElem(point);
        let type = this.isBox(elem) ? Type.box : Type.person;
        elem.classList.remove(type);
        nextElem.classList.add(type);
    },
    isWall(elem) {
        return elem.classList.contains(Type.wall);
    },
    isBox(elem) {
        return elem.classList.contains(Type.box);
    },
    getPointElem({x, y}) {
        return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    },
    initHtml() {
        document.querySelector('table').innerHTML = new Array(18).fill(null).map((tr, trIndex) => {
            let tdHtml = new Array(18).fill(null)
                        .map((td, tdIndex) => `<td data-x="${tdIndex}" data-y="${trIndex}"></td>`).join('')
            return `<tr>${tdHtml}</tr>`;
        }).join('');
    },
    draw(td) {
        if (td.classList.contains(this.type)) {
            td.classList.remove(this.type);
            return;
        }
        switch(this.type) {
            case Type.person:
                let person = document.querySelector('.person');
                if (person) {
                    person.className = '';
                }
                td.className = this.type;
                this.person = td;
                break;
            case Type.target:
                if (td.className === Type.box) {
                    td.classList.add(this.type);
                } else {
                    td.className = this.type;
                }
                break;
            case Type.box:
                if (td.className === Type.target) {
                    td.classList.add(this.type);
                } else {
                    td.className = this.type;
                }
                break;
            case Type.wall:
                td.className = this.type;
        }
    },
    initEvent() {
        let table = document.querySelector('table');

        Array.from(document.querySelectorAll('label')).forEach((label) => {
            label.addEventListener('click', () => {
                this.type = document.querySelector('input:checked').value;
            });
        });

        let hoverTd = null;
        let mouseover = (e) => {
            if (e.target.tagName !== 'TD') {
                return;
            }
            if (hoverTd !== e.target) {
                hoverTd = e.target;
                this.draw(hoverTd);
            }
            e.preventDefault();
        };
        table.addEventListener('mousedown', (e) => {
            hoverTd = e.target;
            if (hoverTd.tagName !== 'TD') {
                return;
            }
            this.draw(hoverTd);
            table.addEventListener('mouseover', mouseover);
        });

        table.addEventListener('mouseup', (e) => {
            table.removeEventListener('mouseover', mouseover);
        });

        table.addEventListener('mouseleave', (e) => {
            table.removeEventListener('mouseover', mouseover);
        });

        window.addEventListener('keydown', (e) => {
            let direction = {
                ArrowLeft: 0,
                ArrowUp: 1,
                ArrowRight: 2,
                ArrowDown: 3,
            }[e.key];
            if (direction === undefined) {
                return;
            }
            this.move(direction);
        });
    },
    init() {
        this.initHtml();
        this.initEvent();
    }
};

App.init();