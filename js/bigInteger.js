/**
 * Created by Administrator on 2016/7/28.
 */
String.prototype.paddingLeft = function (str, len) {
    if (this.length >= len || !str.length) {
        return this;
    } else {
        var num = Math.ceil((len - this.length) / str.length);
        var temp = [];
        for (var i = 0; i < num; i++) {
            temp[i] = str
        }
        return temp.join('').substr(0, len - this.length) + this;
    }
};


function BigInteger() {
    this.value = (arguments[0] || 0).toString();
    this.length = this.value.length;
}

BigInteger.prototype = {
    constructor : BigInteger,
    add : function(num) {
        if (num.constructor != BigInteger)
            num = new BigInteger(num)

        var carry = 0, result = [], long, short, sum, longLen;
        if (this.length > num.length) {
            long = this.value;
            short = num.value;
        } else {
            short = this.value;
            long = num.value;
        }
        longLen = long.length;

        short = short.paddingLeft('0',longLen);

        for (var i = longLen - 1; i >= 0; i--) {
            sum = (+ short[i]) + (+long[i]) + carry;
            carry = sum < 10 ? 0 : 1;
            result.unshift(sum % 10);
        }
        carry > 0 && result.unshift(carry);

        return result.join('');
    },
    length : function() {
        return this.value.length;
    },
    valueOf : function() {
        return this.value;
    },
    _zeroize : function(num) {
        var zeros = '';
        for (var i = 0; i < num.length; i++) {
            zeros += '0'
        }
        this.value += zeros;
    }

};