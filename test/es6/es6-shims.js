(function () {
    
    //String
    var strPro = String.prototype;
    /*! https://mths.be/at v0.2.0 by @mathias */
    if (!strPro.at) {
        (function() {
            'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements.
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch (exception) {}
                return result;
            }());
            var at = function(position) {
                if (this == null) {
                    throw TypeError();
                }
                var string = String(this);
                var size = string.length;
                // `ToInteger`
                var index = position ? Number(position) : 0;
                if (index != index) { // better `isNaN`
                    index = 0;
                }
                // Account for out-of-bounds indices
                // The odd lower bound is because the ToInteger operation is
                // going to round `n` to `0` for `-1 < n <= 0`.
                if (index <= -1 || index >= size) {
                    return '';
                }
                // Second half of `ToInteger`
                index = index | 0;
                // Get the first code unit and code unit value
                var cuFirst = string.charCodeAt(index);
                var cuSecond;
                var nextIndex = index + 1;
                var len = 1;
                if ( // Check if it’s the start of a surrogate pair.
                cuFirst >= 0xD800 && cuFirst <= 0xDBFF && // high surrogate
                size > nextIndex // there is a next code unit
                ) {
                    cuSecond = string.charCodeAt(nextIndex);
                    if (cuSecond >= 0xDC00 && cuSecond <= 0xDFFF) { // low surrogate
                        len = 2;
                    }
                }
                return string.slice(index, index + len);
            };
            if (defineProperty) {
                defineProperty(strPro, 'at', {
                    'value': at,
                    'configurable': true,
                    'writable': true
                });
            } else {
                strPro.at = at;
            }
        }());
    }
    if (!strPro.includes) {
        strPro.includes = function (str, begin) {
            begin = begin || 0;
            return this.slice(begin).indexOf(str) != -1;
        }
    }
    if (!strPro.startsWith) {
        strPro.startsWith = function (str, begin) {
            begin = begin || 0;
            return this.slice(begin).indexOf(str) == 0;
        }
    }
    if (strPro.endsWith) {
        strPro.endsWith = function (str, len) {
            var strLen = str.length,
                _str = this.slice(0, len);
            return strLen == 0 || _str.indexOf(str) == _str.length - strLen;
        }
    }
    if (!strPro.repeat) {

    }
    /**
     * padStart
     * padEnd
     * String.raw
     */

    //Number

    /**
     * Number.
     *  isFinite
     *  isNaN
     *  parseInt
     *  parseFloat
     *  isInteger
     *  isSafeInteger
     *  EPSILON //2.220446049250313e-16 极小的常量
     *  MAX_SAFE_INTEGER
     *  MIN_SAFE_INTEGER
     */

    /**
     * Math.
     *  trunc //去除小数部分
     *  sign
     *  cbrt // 立方根
     *  clz32 返回一个数的32位无符号整数形式有多少个前导0。
     *  imul方法返回两个数以32位带符号整数形式相乘的结果
     *  fround方法返回一个数的单精度浮点数形式。
     *  hypot方法返回所有参数的平方和的平方根。
     *  expm1 Math.expm1(x)返回ex - 1，即Math.exp(x) - 1。
     *  log1p Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN。
     *  log10 Math.log10(x)返回以10为底的x的对数。如果x小于0，则返回NaN。
     *  log2 返回以2为底的x的对数。如果x小于0，则返回NaN。
     *
     *  Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
     *  Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
     *  Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
     *  Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
     *  Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
     *  Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）
     */

    /**
     * Array.
     *  from
     *  of
     * Array.prototype.
     *  copyWithin 在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
     *  find
     *  findIndex
     *  fill
     *  findIndex
     *  keys
     *  values
     *  includes
     */


    /**
     * function.
     *  name 这个属性早就被浏览器广泛支持，但是直到 ES6，才将其写入了标准。
     */

    /**
     * Object.
     *  is
     *  assign
     *  values
     *  entries
     *
     */
})();
