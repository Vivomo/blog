class Liquid{
    constructor(data) {
        this.mass = data.mass;
        this.viscosity = data.viscosity || 5;
    }

    set viscosity(value){
        let temp = Number(value.toFixed(0));
        if (temp < 1) {
            throw 'viscosity 必须大于等于 1'
        }
        this._viscosity = temp;
    }

    get viscosity() {
        return this._viscosity;
    }
}

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

