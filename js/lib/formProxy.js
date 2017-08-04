function FormProxy(cfg) {
    return this.init(cfg);
}

FormProxy.prototype = {
    constructor: FormProxy,
    type: 'get',
    action: '',
    beforeSubmit: function () {},
    success: function () {},
    onError: function () {

    },
    values: function () {
        
    },
    submit: function () {
        
    },
    init: function (cfg) {
        this.initForm(cfg.form);

    },
    initForm: function(form) {
        var formElem;
        if (typeof form == 'string') {
            formElem = document.querySelector(form);
            if (!formElem) {
                throw 'Invalid form selector';
            }
        } else if (form.constructor == HTMLFormElement) {
            formElem = form;
        } else {
            throw 'From must be a selector or a HTMLFormElement';
        }
        this.form = formElem;
    }
};