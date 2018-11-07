### 组件化的理解
```text
组件化的思想主要体现在封装和复用上

封装
对视图, 数据, 内部逻辑的封装 

复用
 props传递
```

### JSX
```text
本质是语法糖，需被解析成 JS 才能运行
JSX 是独立的标准，可被其他项目使用
JSX 是 React 引入的，但不是 React 独有的
JSX 的写法大大降低了学习成本和编码工作量
同时，JSX 也会增加 debug 成本

```

### JSX 和 vdom 的关系
```text
为何需要 vdom
JSX 需要渲染成 html，数据驱动视图

React.createElement 和 h (snabbdom) ，都生成 vnode

何时 patch： ReactDOM.render(…) 和 setState
```

### setState
```text
setState 和 Vue 修改属性 都是异步的
因为
    setState可能会多次执行, 没必要重新渲染, 考虑性能
    即便是每次重新渲染，用户也看不到中间的效果(JS单线程)


```