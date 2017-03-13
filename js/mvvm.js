(function (root) {

    var v = root.V = {
        define : function () {

        },
        scan : function () {

        },

        init : function (cfg) {
            var vm = {};
            for (var k in cfg) {
                Object.defineProperty(vm, k, {
                    get : function () {
                        return vm['_'+k]
                    }
                })
            }
        }
    }

})(window);
