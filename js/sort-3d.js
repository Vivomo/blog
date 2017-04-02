//(function () {
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
                });

                avalon.scan();
            }
        }
    })();

    var Sort = (function () {
        var defaultKey = 'height';
        return {
            swap: function (arr, i, j, key) {
                if (arr[i][key] - arr[j][key] > 0) {
                    var temp = arr[i].index;
                    arr[i].index =arr[j].index;
                    arr[j].index = temp;
                    var item = arr[i].$model;
                    arr.splice(i, 1, arr[j].$model);
                    arr.splice(j, 1, item);
                }
            },

            bubble: function (arr, key) {
                key = key || defaultKey;
                var lastIndex = arr.length - 1;
                for (var i = 0; i < lastIndex; i++) {
                    for (var j = lastIndex; j > i; j--) {
                        this.swap(arr, j - 1, j, key);
                    }
                }
            }
        }
    })();

    cube.init();




//})();
