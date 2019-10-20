let noop = () => {};

class NumericInput {
    static type = {
        integer: 'integer',
        positiveNumber: 'positiveNumber',
        naturalNumber: 'naturalNumber',
        defaults: 'defaults'
    };

    constructor(config = {}) {
        let {input, type, onChange = noop} = config;
        if (!type) {
            type = input.dataset.numberType || NumericInput.type.defaults;
        }
        if (!NumericInput.type[type]) {
            throw new Error('invalid type')
        }
        input._reg = this._regMap[type];
        input.addEventListener('input', this._onInputMap[type]);
        input._onChange = onChange;
    }

    _regMap = {
        integer: /^-?(0|[1-9]\d*)?$/,
        positiveNumber: /^(0|[1-9]\d*)(\.\d*)?$/,
        naturalNumber: /^(0|[1-9]\d*)?$/,
        defaults: /^-?(0|[1-9]\d*)(\.\d*)?$/
    }

    _onInputMap = {
        integer: function () {
            let value = this.value;
            if (!isNaN(value) && this._reg.test(value) || value === '' || value === '-') {
                this.tempValue = value;
                this._onChange(value);
            } else {
                this.value = this.tempValue || '';
            }
        },
        positiveNumber: function () {
            let value = this.value;
            if (!isNaN(value) && this._reg.test(value) || value === '') {
                this.tempValue = value;
                this._onChange(value);
            } else {
                this.value = this.tempValue || '';
            }
        },
        naturalNumber: function () {
            let value = this.value;
            if (!isNaN(value) && this._reg.test(value) || value === '') {
                this.tempValue = value;
                this._onChange(value);
            } else {
                this.value = this.tempValue || '';
            }
        },
        defaults: function () {
            let value = this.value;
            if (!isNaN(value) && this._reg.test(value) || value === '' || value === '-') {
                this.tempValue = value;
                this._onChange(value);
            } else {
                this.value = this.tempValue || '';
            }
        }
    }
}

