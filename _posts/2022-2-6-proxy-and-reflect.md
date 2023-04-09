---
layout: blog
title: JS中的Proxy和Reflect
tags: js,base
---

ES6 新增的 Proxy 和 Reflect 提供了拦截能力和向基本操作中嵌入额外行为的能力。此前的 ES6 并没有类似代理的特性，
因此，Proxy 是一种新的基础性语言能力，**无法 polyfill**。

### 基础使用
```js
const target = { id: 1 };
const handler = {};
const proxy = new Proxy(target, handler);

console.log(proxy.id); // 1

// 给属性目标赋值会反应在两个对象上
target.id = 2;
console.log(proxy.id); // 2

// Proxy.prototype 是 undefined, 因此不能用instanceof 操作符
console.log(proxy instanceof Proxy); // TypeError: Function has non-object-prototype
```

### 捕获器
使用代理的主要目的是可以定义捕获器，用来处理一些基本操作。每次在代理对象上调用这些基本操作时，
代理可以在这些操作传播到目标对象之前先调用捕获器函数，从而拦截并修改相应的行为。
所有捕获器都可以访问相应的参数，基于这些参数可以重建被捕获方法的原始行为。
比如，get()捕获器会接收到目标对象、要查询的属性和代理对象三个参数。

```js
const target = { id: 1 };
const handler = {
  get() { return 'from proxy get' }
};
const proxy = new Proxy(target, handler);

console.log(target.id); // from proxy get
```

### 捕获器不变式
根据 ECMAScript 规范，每个捕获的方法都知道目标对象上下文、捕获函数签名，而捕获处理程序的行为必须遵循“捕获器不变式”（trap invariant）。捕获器不变式因方法不同而异，但通常都会防止捕获器定义出现过于反常的行为。
比如，如果目标对象有一个不可配置且不可写的数据属性，那么在捕获器返回一个与该属性不同的值时，会抛出 TypeError：
```js
const target = {};
Object.defineProperty(target, 'id', {
  configurable: false,
  writable: false,
  value: 1,
});
const handler = {
  get() {
    return 2;
  },
};
const proxy = new Proxy(target, handler);
console.log(proxy.foo); // TypeError
```
### 撤销代理
有时候可能需要中断代理对象与目标对象之间的联系。new Proxy 创建的代理在生命周期种会一直存在。
Proxy 也暴露了 revocable()方法，这个方法支持撤销代理对象与目标对象的关联。后续可直接调用撤销函数 revoke() 来撤销代理。
撤销代理之后再调用代理会抛出 TypeError，撤销函数和代理对象是在实例化时同时生成的：
```js
const target = { id: 1};
const handler = {
  get() {
    return 2;
  },
};
const { proxy, revoke } = Proxy.revocable(target, handler);
console.log(proxy.foo); // 2
console.log(target.foo); // 1
revoke();
console.log(proxy.foo); // TypeError

```
### 状态标记
```js
const target = {};
try {
  Object.defineProperty(target, id, 1);
  console.log('success');
} catch (e) {
  console.log('failed')
}
```
如果定义新属性发生异常，Reflect.defineProperty 会返回false，而不是抛异常，因此可以如此重构
```js
const target = {};
if (Reflect.defineProperty(target, id, 1)) {
  console.log('success');
} else {
  console.log('failed')
}
```
以下反射方法都会提供状态标记
* Reflect.defineProperty()
* Reflect.preventExtensions()
* Reflect.setPrototypeOf()
* Reflect.set()
* Reflect.deleteProperty()

以下反射方法是只有操作符才能完成的操作
* Reflect.get() 替代 属性访问操作符
* Reflect.set() 替代 =
* Reflect.has() 替代 in 或 with()
* Reflect.deletePrototype() 替代 delete
* Reflect.construct() 替代 new

### 代理的问题和不足

#### 代理中的this
```js
const wm = new WeakMap();
class User {
  constructor(id) {
    wm.set(this, id);
  }
  set id(id) {
    wm.set(this, id)
  }
  get id() {
    return wm.get(this);
  }
}
// 由于这个实现依赖 User 实例的对象标识，在这个实例被代理的情况就会出问题
const user = new User(123);
const proxy = new Proxy(user, {});
console.log(proxy.id); // undefined
```
这是因为 User 实例一开始使用目标对象作为 WeakMap 的键，代理对象却常是从自身取得这个实例。要解决这个问题需要重新配置代理，
把代理User实例改为代理User类本身。之后再创建代理的实例就会以代理实例作为WeakMap的键了。
```js
const UserProxy = new Proxy(User, {});
const proxy = new UserProxy(123);
console.log(proxy.id);
```

#### 代理与内部槽位
代理与内置引用类型(比如Array)的实例通常可以很好地协同，但有些 ECMAScript内置类会依赖代理无法控制的机制，
结果导致在代理上调用某些方法会出错。一个典型的例子就是 Date类型。根据 ECMAScript规范，
Date 类型方法的执行依赖 this值部槽位[[NumberDate]]。代理对象上不存在这个内部槽位，
而且这个内部槽位的值也不能通过get()和set()操作访问到，于是代理拦截后本应转发给目标对象的方法会抛出 TypeError:
```js
const date = new Date();
const proxy = new Proxy(date, {});
console.log(proxy instanceof date); // true
proxy.getDate(); // TypeError: 'this' is no a Date object
```

### 其它

在Vue2到Vue3的演进中，Vue3放弃了Object.defineProperty，改用了Proxy和Reflect，有以下原因：

* 它只能劫持对象的属性，不能劫持整个对象，所以需要遍历对象的每个属性，并且如果属性值是嵌套的对象，还需要进行深度遍历。
* 它不能监听数组的变化，所以 Vue 2.x 对数组做了一些特殊处理，比如重写了数组的一些方法（push、pop、shift、unshift、splice、sort、reverse）。
* 它不能检测到对象属性的新增或删除，所以 Vue 2.x 提供了一些全局方法（Vue.set、Vue.delete）来解决这个问题。

Proxy 的优点有：

* 它可以代理任何类型的数据，包括数组、Map、Set 等。
* 它可以检测到对象属性的新增或删除，而不需要额外的方法。
* 它可以拦截更多的操作，比如 in、delete、Object.keys 等。