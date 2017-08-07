/**
 * 只是为了展示代理模式, 实际项目的中代码不会这么单纯
 */
class FormProxy{
    constructor(form) {
        this.form = form;
        this._elements = null;
    }

    get elements() {
        if (!this._elements) {
            this.elements = this.form.elements;
        }
        return this.elements;
    }

    set elements(elements) {
        this._elements = elements;
    }

    // 提交
    submit() {
        this.form.submit();
    }
}

(function () {
    const formProxy = new FormProxy(document.getElementById('form'));
    console.log(formProxy.elements);
    formProxy.submit();
})();
