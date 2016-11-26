/**
 * Vimo的库
 *
 */

(function (root) {
    /**
     * 数组修复
     */
    var _ArrayProp = {
        indexOf : function (item, index) {
            var n = this.length, i = ~~index;
            if (i < 0) {
                i += n;
            }
            for (; i < n; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    };
    var v = root.V = {};

    v.cache = {
        js : []
    };
    var DOC = document;

    /**
     * document.ready 回调
     */
    v.domReady = function (fn) {
        if (document.body) {
            fn()
        } else {
            if(DOC.addEventListener){
                DOC.addEventListener('DOMContentLoaded',function(){
                    DOC.removeEventListener('DOMContentLoaded',arguments.callee,false);
                    fn();
                },false);
            }else if(DOC.attachEvent){
                DOC.attachEvent('onreadystatechange',function(){
                    if(DOC.readyState=='complete'){
                        DOC.detachEvent('onreadystatechange',arguments.callee);
                        fn();
                    }
                });
            }
        }
    };

    /**
     * 判断param是否是一个方法
     */
    v.isFunction = function (param) {
        return typeof param === 'function';
    };

    v.loadJS = function (url, callback) {
        if (v.cache.js.indexOf(url) != -1)
            return;
        var script = document.createElement('script');
        var supportLoad = "onload" in script;
        var onEvent = supportLoad ? "onload" : "onreadystatechange"
        script[onEvent] = function () {
            if (supportLoad || /complete|loaded/.test()) {
                callback && callback();
            }
        };
        document.head.appendChild(script);
        script.src = url;
        v.cache.js.push(url);
    }

})(window);
