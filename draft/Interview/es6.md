### ES6模块化的使用与打包
```js
// 语法 a.js
export default {
    a: 1
}

// b.js
export const b1 = 1;
export const b2 = 2;

// index.js
import a from 'a.js'
import {b1, b2} from 'b.js'
```

```text
开发环境

node环境下 npm init
npm i babel-core babel-preset-es2015 babel-preset-latest -D
npm i --global babel-cli
新建文件 .babelrc
{
  "presets": ["es2015", "latest"],
  "plugins": [],
  "ignore": []
}
babel example.js

```

```text
babel 只能转义es6语法, 对于模块化是转义不了的, 需要webpack配合

npm install webpack babel-loader --save-dev

编辑 package.json script 添加 start 命令 "webpack"
编辑webpack.config.js (参照官网)
npm start

```

```text
rollup 
目前Vue 和 React 使用的打包方式
npm init
npm i rollup rollup-plugin-node-resolve rollup-plugin-babel babel-plugin-external-helpers babel-preset-latest -D
编辑 .babelrc
编辑  rollup.config.js

```

### Class与普通构造函数的区别
```text
Class 在语法上更加贴合面向对象的写法
Class 实现继承更加易读、易理解
本质还是语法糖，使用 prototype

```

### Promise的使用和原理
```javascript 1.7
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
```

```text
所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点。

（1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的
```

### ES6常用功能
* let/const
* 多行字符串/模板变量
* 解构赋值
* 块级作用域
* 函数默认参数
* 箭头函数

