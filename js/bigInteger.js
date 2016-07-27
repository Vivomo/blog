/**
 * Created by Administrator on 2016/7/28.
 */

function BigInteger() {
    this.value = (arguments[0] || 0).toString();
    this.length = this.value.length;
}

BigInteger.prototype = {
    constructor : BigInteger,
    add : function(num) {
        if (num.constructor != BigInteger)
            num = new BigInteger(num)

        var carry = 0, result = [], long, short, sum, longLen, shortLen, index, diff;
        if (this.length > num.length) {
            long = this.value;
            short = num.value;
        } else {
            short = this.value;
            long = num.value;
        }
        longLen = long.length;
        shortLen = short.length;
        diff = longLen - shortLen;

        for (var i = 0; i < shortLen; i++) {
            index = shortLen - 1 - i;
            sum = (+ short[index]) + (+long[diff + index]) + carry;
            carry = sum < 10 ? 0 : 1;
            result.push(sum % 10);
        }
        for (var j = 0; j < diff; j++) {
            sum = +long[diff - j - 1] + carry;
            carry = sum < 10 ? 0 : 1;
            result.push(sum % 10);
            if (!carry) {
                return long.substring(0, diff - j) + result.reverse().join('');
            }
        }
        return result.reverse().join('');
    },
    length : function() {
        return this.value.length;
    },
    valueOf : function() {
        return this.value;
    }
};