/**
 * Created by ui on 2016/9/9.
 */

;(function () {
    var reg = /\{\{\s*(\w+)\s*(\|\s*(\w+)(\((.*)\))?)?}}/;
    var vt = {
        render : function (str, obj) {
            if (Array.isArray(obj)) {
                obj.forEach(function (item) {
                    return vt.render(str, item)
                })
            } else if(obj && (typeof obj == 'object')) {
                str.replace(/\{\{(.+?)}}/g, function (val, index) {
                    var result = reg.exec()
                })
            }
            return str;
        }
    }
})();

