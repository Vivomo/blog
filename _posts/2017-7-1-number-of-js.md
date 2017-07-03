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
> 5. 数值的范围
> 6. 数值的转换
> 7. 数值的拓展与修复
> 8. API使用注意点
> 9. ES6中的数值

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

