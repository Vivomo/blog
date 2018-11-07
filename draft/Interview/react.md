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

### React VS Vue
```text
本质区别
Vue 本质是MVVM框架, 由MVC发展而来
React - 本质是前端组件化框架，由后端组件化发展而来
但这并不妨碍他们两者都能实现相同的功能

模板的区别
Vue - 使用模板（最初由 angular 提出）
React - 使用 JSX
模板语法上，我更加倾向于 JSX
模板分离上，我更加倾向于 vue (模板和JS逻辑的分离)


组件化的区别
React 本身就是组件化，没有组件化就不是 React
vue 也支持组件化，不过是在 MVVM 上的扩展
查阅 vue 组件化的文档，洋洋洒洒很多（侧面反映）
对于组件化，我更加倾向于 React ，做的彻底而清晰

两者共同点
都支持组件化
都是数据驱动试图

------------------
国内使用，首推 vue 。文档更易读、易学、社区够大
如果团队水平较高，推荐使用 React 。组件化和 JSX


```