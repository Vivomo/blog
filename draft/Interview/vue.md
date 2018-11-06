### MVVM框架的三要素 如Vue

#### 响应式：vue 如何监听到 data 的每个属性变化？
核心 API `Object.defineProperty`
data 属性被代理到 vm 上
example[https://github.com/Vivomo/blog/blob/gh-pages/nodejs/defineProperty.js]
#### 模板引擎：vue 的模板如何被解析，指令如何处理？
```text
模板的本质就是字符串
有逻辑，如 v-if v-for 等
与 html 格式很像，但有很大区别
最终还要JS(一个render函数)转换为 html 来显示

```
#### 渲染：vue 的模板如何被渲染成 html ？以及渲染过程

