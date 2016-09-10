/**
 * Created by ui on 2016/9/9.
 */

;(function () {
    var reg = /\s*(\w+)\s*(\|\s*(\w+)(\((.*)\))?)?/;
    var vt = {
        render : function (str, obj) {
            if (Array.isArray(obj)) {
                return obj.map(function (item) {
                    return vt.render(str, item)
                }).join('');
            } else if(obj && (typeof obj == 'object')) {
                str.replace(/\{\{(.+?)}}/g, function (s, $1, index) {
                    /**
                     *  eg. $1 = a | b("YY", 2) => ["a | b("YY", 2)", "a", "| b("YY", 2)", "b", "("YY", 2)", ""YY", 2"]
                     *  eg. $1 = a | b() => ["a | b()", "a", "| b()", "b", "()", ""]
                     *  eg. $1 = a | b  => ["a | b", "a", "| b", "b", undefined, undefined]
                     */
                    var result = reg.exec($1);
                    var filter = result[3];
                    var key = result[1];
                    if (filter) {
                        if (vt.filters[filter]) {
                            return new Function(key)
                        } else {
                            console.error('The filter of ' + filter + ' is not defined')
                        }
                    } else if(key in obj){
                        return obj[key]
                    }
                    return s;


                })
            }
            return str;
        }
    }
})();

