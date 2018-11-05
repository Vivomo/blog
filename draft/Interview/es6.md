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

### ES6常用功能