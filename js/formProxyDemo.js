class FormProxy{
    constructor(form) {
        this.form = form;
    }

    // 验证字段
    valid() {
        return true;
    }

    // 获取值
    getValues() {
        return Array.form(this.form.elements).map(elem => ({
            name: elem.name,
            value: elem.value
        }))
    }

    // 提交
    submit() {

    }
}

(function () {
    const formProxy = new FormProxy(document.getElementById('form'));
    console.log(formProxy.getValues());
    formProxy.submit();
})();