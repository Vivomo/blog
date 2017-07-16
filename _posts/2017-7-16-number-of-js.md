---
layout: blog
title: 基础——重中之重之JS中的数值
description: JavaScript中有关数值的介绍
keywords: JavaScript, Number
---

数值与字符串可以说是几乎所有业务逻辑都会打交道的东西了, 本篇博客重点讲解JS中数值的相关概念与操作.
JS的数值是一个很大话题.涉及的很多的层面,本文重点讲解以下几个方面.

> 1. 什么是IEEE754格式
> 2. 进制
> 3. 浮点数
> 4. 科学计算法
> 6. 数值的转换
> 7. 数值API的修复与使用注意点

#### IEEE754
JS处理数值时,会先尝试用32bit的整数来处理, 如果范围超出(2^31)或不是整数,则会用64位的[IEEE754](http://baike.baidu.com/item/IEEE%20754/3869922)格式处理.(
IEEE 是电气电子工程师学会(Institute of Electrical and Electronics Engineers)的简称
754的是啥没查到,可能是研究小组的代号,有知道的可以在评论区告知下,谢谢.)

64位中 符号位占1位,指数位占11位,有效数值占52位
由此决定了JS数值的表达范围

JS没有像JAVA 那样数字按字节划分, JS的数字只有一个Number类型, 因为采用IEEE754格式表示,所以决定了他数值的表示范围.
极值可以由Number.MAX_VALUE 和 Number.MIN_VALUE 得到, 超出极值的运算会返回±Infinity

```js
console.log(Math.pow(2, 1023)); //8.98846567431158e+307
console.log(Math.pow(2, 1024)); //Infinity
```

#### 进制
JS的数字支持2进制,8进制,10进制和16进制来表示
```js
// 2进制 是ES6新增的 以0b | 0B 开头, 如果后面的数字是不合法的2进制数字会抛出SyntaxError
var num2 = 0B100; // 4
// 8进制 数字以0开头, JS引擎会尝试去以8进制去解析,如果失败则在以10进制去解析, 因为这样会存在歧义, 所以ES6新增了0o为8进制的标识前缀
// 在ES5的运行环境中下面的声明会报错
var num8 = 0o70; // 56
// 16进制 以0x标识前缀
var num16 = 0xaa; // 170
```

#### 浮点数

即数字中必须好汉一个小数点, 且小数点后面必须有一个数字
```js
var floatNum = 0.1; // 可以简写为 .1, 但极不推荐,可读性很差
```

##### 关于浮点数的精度
```js
console.log(0.1 + 0.2) // 0.30000000000000004
```
这是IEEE754数值浮点数计算的通病, 并非只有JS, Java, Python 也一样, 因为计算的2进制并不能准确的表达所有的浮点数, 也正如10进制无法准确的表示`1/3`一样

#### 科学计数法

当数字位数很长时,表面上看就很不直观, 所以便有了科学计数法 如`10000000000`可以表示为 `1e10`,这样就很直观, 而且当位数很长时, JS引擎会自动将其用科学计数法表示.
这样会产生一个坑, 下面解释

#### 数值的转换
有三个API可以将非数值转换为数值: 
> 1. Number 可以接受任意数据类型
> 2. parseInt, parseFloat 专门用于处理**字符串**

Number的转换规则为
> 1. true => 1 false => 0
> 2. null => 0
> 3. undefined => NaN
> 4. Object => 调用其valueOf 如果NaN 则调用其toString 方法, 在执行下面String的规则
> 5. String 这个情况比较多, 下面依次分类说明


##### String => Number
> 1. 只包含数字 => 10进制数字
> 2. 有效浮点数 => 浮点数
> 3. 有效十六进制 => 相等的10进制  `Number("0xa") => 10`
> 4. else => NaN

#### 数值API的修复
精度问题是没办法处理的, JS不像Java有BigInteger 和 BigDecimal这种以专门处理精度的类.
但有一个API我们常用却极少关注的,甚至很少有资料说明其错误的, 也可能是多数业务场景后端都帮前端计算好了,前端只负责一个数值展示吧
那个API就是toFixed, 下面是ES5 规范的对其使用说明.
Number.prototype.toFixed (fractionDigits)
令 f 为 ToInteger(fractionDigits). ( 如果 fractionDigits 是 undefined, 此步骤产生 0 值 ).
如果 f < 0 或 f > 20, 抛出一个 RangeError 异常 .
令 x 为 this 数字值 .
如果 x 是 NaN, 返回字符串 "NaN".
令 s 为空字符串 .
如果 x < 0, 则
令 s 为 "-".
令 x = –x.
如果 x ≥ 1021, 则
令 m = ToString(x).
否则 , x < 1021
令 n 为一个整数，让 n ÷ 10f – x 准确的数学值尽可能接近零。如果有两个这样 n 值，选择较大的 n。
如果 n = 0, 令 m 为字符串 "0". 否则 , 令 m 为由 n 的十进制表示里的数组成的字符串（为了没有前导零）。
如果 f ≠ 0, 则
令 k 为 m 里的字符数目 .
如果 k ≤ f, 则
令 z 为 f+1–k 个 ‘0’ 组成的字符串 .
令 m 为 串联字符串 z 的 m 的结果 .
令 k = f + 1.
令 a 为 m 的前 k–f 个字符，令 b 为其余 f 个字符。
令 m 为 串联三个字符串 a, ".", 和 b 的结果。
返回串联字符串 s 和 m 的结果。
 toFixed 方法的 length 属性是 1。
 
说白了就是指定小数位数的四舍五入
但...
```js
(1.15).toFixed(1); // 1.1
(1.25).toFixed(1); // 1.3
```

薛定谔的小数...
针对这个情况我写了一个修复
```js
Number.prototype.toFixed2 = function (fractionalDigits, notKeepZero) {
    var fixedNum = this,
        _fd = fractionalDigits;
    if (this % 1 && fractionalDigits) {
        var num = 1;
        while (fractionalDigits-- > 0) {
            num *= 10;
        }
        fixedNum = Math.round(this * num ) / num;
    }
    return notKeepZero ? fixedNum : fixedNum.toFixed(_fd);
};
```
#### API使用注意点
这里就说一个吧 `parseInt`
一个注意点是其参数, 首先他需要两个参数, 第二个参数代表数值进制, 默认不传就是10
但ES3 和 ES5 对 `070`的执行不一致, 前者认为可以转八进制, 后者直接还是按默认参数的值来执行, 所以ESlint有对parseInt第二个参数的检查
同时写业务逻辑时, 假如我们要把一个数组全部转化为数字可能会这么写
```js
var strArr = ['1', '2', '3'];
var numArr = strArr.map(parseInt);
// 结果
console.log(numArr); // [1, NaN, NaN]
```
真是因为parseInt需要两个参数, 所以上面等同于执行了
```js
parseInt('1', 0);
parseInt('2', 1);
parseInt('3', 2);
```
另一个是parseInt的执行过程
他会首先把第一个参数执行其toString方法, 然后从第一个字符开始读取, 一直到非有效数字为止 , 如果没有有效数字则返回`NaN`
```js
parseInt('11a'); // 11
parseInt('a'); // NaN
```
第一个参数即使你传的是数值也不例外,也会先转为字符串, 但这会有什么影响呢, 看下面的代码
```js
parseInt(0.000001); // 0
parseInt(0.0000001); // 1
```
OK, 这里就是我上面说科学计数法里面的那个坑, 0.0000001 toString 为 "1e-7", 所以`parseInt(0.0000001)` 等同于 `parseInt("1e-7")`
知道有这些注意点, parseInt还是能帮我们省不少事哒, 比如正则提取前面数字什么的, 具体看业务需求.


#### 结束语
零零碎碎想到了这么多, 数值是一个很大的话题, 难免会有遗漏, 如果读者有什么意见和建议, 欢迎在评论区留言