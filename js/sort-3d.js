(function () {
    avalon.config({
        interpolate: ["[[", "]]"]
    });
    var row = 3;
    var col = 20;
    var vm = avalon.define({
            $id: 'square',
            w: 40,
            row: row,
            col: col,
            list: []
        }),
        square = document.querySelector('.square');

    var cube = (function(){
        var maxHeight = 400;
        return {
            init: function () {
                vm.list = avalon.range(0, vm.col).map(function (index) {
                    return {
                        index: index,
                        height: ~~(Math.random() * maxHeight)
                    }
                })

                avalon.scan();
            }
        }
    })();

    cube.init()




})();
