/**
 * 格式化数字  四千八百六十九 => 4869
 * @constructor
 */
var NumberParser = (function () {

    var numberMap = {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9
    };

    var quantifierMap = {
        十: 10,
        百: 100,
        千: 1000,
        万: 10000,
        亿: 100000000,
    };

    var zeroToken = '零';

    function translate(num){
        var numberComponent = [];
        for (var i = 0; i < num.length; i++) {
            var char = num[i];
            if (char in numberMap) {
                numberComponent.push(numberMap[char]);
            } else if (char in quantifierMap) {
                numberComponent[numberComponent.length - 1] *= quantifierMap[char];
            } else {
                if (zeroToken !== char) {
                    throw '不合法的数字'
                }
            }
        }
        return numberComponent;
    }

    return {
        parse: function (num) {
            var numberComponent = translate(num);
            var sum = 0;
            numberComponent.forEach(function (number) {
                sum += number;
            });
            return sum;
        }
    }
})();

console.log(NumberParser.parse('九万亿四千八百六十九'));