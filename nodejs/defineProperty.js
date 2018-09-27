let v = {
    data: {
        a: 1,
        b: 2,
        c: 3
    },
    render() {
        return `a:{{a}}, b: {{b}}, c: {{c}}`.replace(/{{(\w+)}}/g, (str, $1) => this[$1])
    }
};

let VP = (v) => {
    let _v = {
        _data: Object.assign({}, v.data),
        render: v.render
    };
    for (let k in v.data) {
        Object.defineProperty(_v, k, {
            set(val) {
                this._data[k] = val;
                console.log(this.render());
            },
            get() {
                return this._data[k]
            }
        })
    }
    return _v;
};

let vm = VP(v);

console.log(vm.render());

setTimeout(() => {
    vm.a = 10;
}, 100);


setTimeout(() => {
    vm.b = 5;
}, 300);

setTimeout(() => {
    vm.c = 1000;
}, 1000);

