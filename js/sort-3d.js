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
            list: [],
            flash: function (item, time) {
                time = time || 250;
                vm.light(item);
                setTimeout(function () {
                    vm.off(item);
                }, time)
            },
            light: function(item) {
                item.comparing = true;
            },
            off: function (item) {
                item.comparing = false;
            }
        }),
        square = document.querySelector('.square');

    var cube = (function(){
        var maxHeight = 400;
        return {

            init: function () {
                vm.list = avalon.range(0, vm.col).map(function (index) {
                    return {
                        index: index,
                        comparing: false,
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

                if (arr[i][key] > arr[j][key]) {
                    var temp = arr[i].index;
                    arr[i].index =arr[j].index;
                    arr[j].index = temp;

                    setTimeout(function () {
                        var item = arr[i].$model;
                        arr.splice(i, 1, arr[j].$model);
                        arr.splice(j, 1, item);
                    }, 300);
                    return true;
                }
                return false;

            },
            flash: function(){

            },

            bubble: function (arr, key) {
                key = key || defaultKey;
                var lastIndex = arr.length - 1;
                var i = 0,
                    j = lastIndex;
                var interval = setInterval(function () {
                    vm.flash(arr[i]);
                    vm.flash(arr[j]);
                    this.swap(arr, j - 1, j, key);
                    j --;
                    if (j == i) {
                        i++;
                        j = lastIndex;
                    }
                    if (i >= lastIndex) {
                        clearInterval(interval)
                    }

                }.bind(this), 500);
            },
            quick: function(arr, key){

                if (arr.length < 2) {
                    return;
                }


                key = key || defaultKey;

                var len = arr.length,
                    task = [[0, len - 1]];

                sort(task.shift());
                function sort(indexArr) {
                    var start = indexArr[0],
                        end = indexArr[1],
                        i = start + 1,
                        movedStep = 0;

                    vm.light(arr[start]);
                    var interval = setInterval(function () {
                        var _start = start + movedStep;

                        vm.flash(arr[i]);
                        if (arr[_start][key] > arr[i][key]) {
                            arr[i].index = arr[_start].index;
                            for (var m = _start; m < i; m++) {
                                arr[m].index ++;
                            }
                            arr.splice(_start, 0, arr.splice(i, 1)[0]);
                            movedStep++

                        }
                        i ++;
                        if (i > end) {
                            _start = start + movedStep;
                            vm.off(arr[_start]);
                            if (movedStep > 1) {
                                task.push([start, _start - 1]);
                            }
                            if (movedStep < end - start - 1) {
                                task.push([_start + 1, end])
                            }
                            if (task.length > 0) {
                                sort(task.shift())
                            } else {
                                console.log('Quick sort finish');
                            }

                            clearInterval(interval);
                        }
                    }, 300);

                }
            }
        }
    })();

    cube.init();


    function quickSort(array){
        function sort(prev, numsize){
            var nonius = prev;
            var j = numsize -1;
            var flag = array[prev];
            if ((numsize - prev) > 1) {
                while(nonius < j){
                    for(; nonius < j; j--){
                        if (array[j] < flag) {
                            array[nonius++] = array[j];　//a[i] = a[j]; i += 1;
                            break;
                        }
                    }
                    for( ; nonius < j; nonius++){
                        if (array[nonius] > flag){
                            array[j--] = array[nonius];
                            break;
                        }
                    }
                }
                array[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numsize);
            }
        }
        sort(0, array.length);
        return array;
    }



//})();
