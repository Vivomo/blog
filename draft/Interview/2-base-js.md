# 原型和原型链

## question
>. 判断一个变量是数组类型
>. 写一个原型链继承的例子
>. new 一个对象的过程
>. zepto源码适合使用的原型链

## 知识点
``` 
原型规则
所有的引用类型都具有对象的特性, 即可自由拓展属性
所有引用类型都有一个隐式原型属性 __proto__
所有的函数都有一个显示原型属性 prototype
所有的引用类型__proto__属性值都指向他的构造函数的prototype属性
当试图得到一个对象的某个属性时, 如果自身没有这个属性, 那么他会在他的隐式原型中找
```

``` 
instanceof
instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上
```

## answer
``` 
arr instanceof Array
```

``` 
new
create a object
this -> object
默认return this
```