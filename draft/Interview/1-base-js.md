# 变量类型和计算

## question
>. JS中`typeof`能得到哪些类型
>. 何时使用`===`和`==`
>. JS内置函数
>. JS变量按存储方式有哪些类型,分别描述其特点
>. 如何理解JSON

## 知识点
>. 变量类型
>. 变量计算

```
typeof 
undefined -> undefined
1 -> number
'a' -> string
true -> boolean
[] -> object
{} -> -
null -> -
alert -> function
Symbol -> symbol // ES6
```

```
类型转换

字符串拼接
== 运算符
if 语句
逻辑运算
```

```
=== 和 ==
只有为了简写 obj.a === null || obj.a === undefined 的时候 用 ==, jQ源码推荐的写法
其余都用===
```

``` 
JS 内置函数 即不考虑宿主环境
Object
Array
Boolean
Number
String
Math
Function
Date
RegExp
Error
JSON
```

``` 
JS变量按存储方式 值类型与引用类型
```

``` 
如何理解JSON
只是一个JS Object, 也是一个数据格式
```