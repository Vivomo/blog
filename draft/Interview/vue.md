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
updateComponent

### vue 的整个实现流程
> 第一步：解析模板成 render 函数
>> with 的用法
>> 模板中的所有信息都被 render 函数包含
>> 模板中用到的 data 中的属性，都变成了 JS 变量
>> 模板中的 v-model  v-for  v-on 都变成了 JS 逻辑
>> render 函数返回 vnode

> 第二步：响应式开始监听
>> 见上 `响应式`

> 第三步：首次渲染，显示页面，且绑定依赖
>> 初次渲染，执行 updateComponent，执行 vm._render()
>> 执行 render 函数返回 vnode, 会访问到 vm中的data
>> 执行 updateComponent ，会走到 vdom 的 patch 方法
>> patch 将 vnode 渲染成 DOM ，初次渲染完成
```text
监听get的原因:
如果一个属性未被get监听的话, 也就不需关心set
在设置值的的时候不需要执行updateComponent

```

> 第四步：data 属性变化，触发 rerender
>> 修改属性，被响应式的 set 监听到
>> set 中执行 updateComponent
>> updateComponent 重新执行 vm._render()
>> 生成的 vnode 和 prevVnode ，通过 patch 进行对比
>> 渲染到 html 中
