---
layout: blog
title: 基础——重中之重之JS的变量的声明
---

### 写在前面的话

在现在这个浮躁的前端圈，人们盲目学着所谓火热的框架，都多多少少疏忽了技术，但任其框架万变，都万变不离其宗——JS尔。
本系列课程着重讲解JS中基础，一些容易忽略的知识。

#### 本文我们重点聊一下JS的变量声明

说起变量声明大家都是十分熟悉的，在JS声明一个新变量可以用`var`,`const`或者`let`, 他们属于JS里面的操作符,接下来我们来依次聊一下他们

#### 0.无操作符的情况

在JS里面也是支持直接把变量直接赋值不需要声明的,如:

```js
a = 1;
console.log(a); // 1
console.log(window.a) // 1
```
这种情况,会创建一个全局变量, 在严格模式(严格模式是ES5出的, IE10之前不支持)下会报错,项目中极其不推荐这样做,很容易导致变量覆盖引发不可预知的Bug,
目前前端的IED多数会自动检测(如WebStorm),给予一个弱警告,推荐配置ESLint

#### 1.var
JS是弱类型语言,`var`声明的变量无需指定类型, 也可以只声明不赋值,如果只声明会保存一个特殊的值——`undefined`,如下:

```js
var a;
console.log(a === undefined); // true
```
##### 提升
`var`声明变量会导致提升情况, 如下面的代码
```js
console.log(a === undefined); // true
var a;
console.log(b === undefined); //Uncaught ReferenceError: b is not defined
```
变量提升是JS引擎解释执行代码前所做的工作,或者说JS编译时，顺便提一下,在《你不知道的JavaScript上卷》1.1节中，作者有提到JS是编译语言，并给出了解释，
尽管我们把JS归为“动态”和“解释执行”的语言，有兴趣的可以去看一下。下面再给出两个例子
```js
//eg.1
a = 1;
var a;
console.log(a); // 1;
```
如果从直觉上看,认为JS执行时是由上而下一行一行执行力的, 我们会认为结果是`undefined`,再看一个例子
```js
//eg.2
console.log(a);
var a = 1;
```
你猜结果如何? `ReferenceError`或者是1? 结果其实`undefined`。
当你看到`var a = 1`可能认为这是一个声明, 对于JS而言, 其实是两个步骤, 声明`var a`和赋值`a = 1`,但第一步在编译阶段进行的。
所以上面两个例子的处理流程为
```js
var a;
a = 1;
console.log(a);
```
```js
var a;
console.log(a);
a = 1;
```
##### 全局作用域下声明变量会绑定在全局对象上(window)
node.js 未测试
```js
var a = 1;
console.log(window.a); // 1;
```
#### 2.let
`let`是`var`的兄弟，在ES6中引入的新关键字，把变量隐式地劫持在了其作用域（通常是`{...}`中）,如:
```js
if (true) {
    let a = 1;
}
console.log(a); // ReferenceError
```
##### let循环
`for`循环是`let`发挥优势的典型例子, 这里相对于`var`减少了副作用,如:
```js
for (var i = 0; i < 10; i++) {
}
console.log(i); // 10

for (let j = 0; j < 10; j++) {
}
console.log(j); // ReferenceError
```

##### let不存在var一样的变量提升
这个特性是需要稍微注意的
```js
console.log(a); //ReferenceError
let a = 1;
```
##### 全局作用域下声明不变量会绑定在全局对象上(window)
```js
let a = 1;
console.log(window.a); // undefined;
```
#### 3.const
`const`也是ES6引入的新关键词, 它除了拥有`let`上面介绍的特性外,还有两条特性:
>1.`const`声明的变量是不可修改的。
>2.`const`声明的变量必须是其作用域内未定义过的
```js
const a = 1;
a = 2; //Uncaught TypeError: Assignment to constant variable.
```
```js
var a = 1;
const a = 2; //Uncaught SyntaxError: Identifier 'a' has already been declared
```







    
