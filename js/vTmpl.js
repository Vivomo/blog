/**
 * Created by ui on 2016/9/9.
 */

;(function () {
    var reg = /\s*(\w+)\s*(\|\s*(\w+)(\((.*)\))?)?/;
    var vt = window.vTmpl = {
        render : function (str, obj) {
            if (Array.isArray(obj)) {
                return obj.map(function (item) {
                    return vt.render(str, item)
                }).join('');
            } else if(obj && (typeof obj == 'object')) {
                str = str.replace(/\{\{(.+?)}}/g, function (s, $1) {
                    /**
                     *  eg. $1 = a | b("YY", 2) => ["a | b("YY", 2)", "a", "| b("YY", 2)", "b", "("YY", 2)", ""YY", 2"]
                     *  eg. $1 = a | b() => ["a | b()", "a", "| b()", "b", "()", ""]
                     *  eg. $1 = a | b  => ["a | b", "a", "| b", "b", undefined, undefined]
                     */
                    var result = reg.exec($1);
                    var filter = result[3];
                    var key = result[1];
                    var args = result[5];
                    if (key in obj) {
                        if (filter) {
                            if (vt.filters[filter]) {
                                var funcBody = 'return vTmpl.filters["'+filter+'"]('+obj[key]+(args === undefined ? '': ',' + args)+')';
                                return (new Function(funcBody))();
                            } else {
                                console.error('The filter of ' + filter + ' is not defined')
                            }
                        } else {
                            return obj[key]
                        }
                    } else {
                        return s;
                    }
                })
            }
            return str;
        },
        filters : {
            date : function (time, format) {
                var date = new Date(time);
                var dateInfo = {
                    'yyyy' : date.getFullYear(),
                    'YYYY' : date.getFullYear(),
                    'MM' : date.getMonth() + 1,
                    'mm' : date.getMinutes(),
                    'HH' : date.getHours(),
                    'hh' : date.getHours() > 13 ? date.getHours() - 12 : date.getHours(),
                    'dd' : date.getDate()
                };
                return format.replace(/\w+/g, function (key) {
                    return dateInfo[key] || key;
                })
            }
        }
    }
})();

