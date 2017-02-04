/**
 * Created by ui on 2017/2/4.
 * 实现  add(1, 2, 3...) == add(1)(2)(3)...
 */

function add(){
    var value = arrSum(arguments);

    function _add() {
        value += arrSum(arguments);
        return _add;
    }
    _add.toString = function () {
        return value;
    };

    return _add;
}

function arrSum(arr) {
    var sum = 0;
    for (var i = 0, l = arr.length; i < l; i++) {
        sum += arr[i];
    }
    return sum;
}