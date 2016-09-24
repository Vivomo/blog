/**
 * Vimo的库
 *
 */

(function (root) {
    var v = root.V = {};
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

})(window);
