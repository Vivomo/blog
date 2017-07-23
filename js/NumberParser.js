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
        var tokens = [];
        for (var i = 0; i < num.length; i++) {
            var char = num[i];
            if (char in numberMap) {
                tokens.push([numberMap[char], 1]);
            } else if (char in quantifierMap) {
                var lastToken = tokens[tokens.length - 1];
                lastToken[1] *= quantifierMap[char];
            } else {
                if (zeroToken !== char) {
                    throw '不合法的数字'
                }
            }
        }
        return tokens;
    }

    return {
        parse: function (num) {
            var tokens = translate(num);
            var sum = 0;
            tokens.forEach(function (token) {
                sum += token[0] * token[1];
            });
            return sum;
        }
    }
})();

console.log(NumberParser.parse('九万亿四千八百六十九'));