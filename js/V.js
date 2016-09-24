/**
 * Vimo的库
 *
 */

(function (root) {
    var v = root.V = {};

    /**
     * document.ready 回调
     */
    v.domReady = function (fn) {
        if (document.body) {
            fn()
        } else {
            if(document.addEventListener){
                document.addEventListener('DOMContentLoaded',function(){
                    document.removeEventListener('DOMContentLoaded',arguments.callee,false);
                    fn();
                },false);
            }else if(document.attachEvent){
                document.attachEvent('onreadystatechange',function(){
                    if(document.readyState=='complete'){
                        document.detachEvent('onreadystatechange',arguments.callee);
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
