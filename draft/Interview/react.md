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

### React 生命周期

* start  constructor -> componentWillMount -> render -> componentDidMount
* running ->
* state update shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
* props update getDerivedStateFromProps
* error componentDidCatch

### redux 三大原则

* 单一数据源
* State 是只读的
* 使用纯函数来执行修改

### React useTransition
* useTransition是React提供的一个Hook，可以让你在不阻塞UI的情况下更新状态。
* useTransition返回一个数组，包含两个元素：isPending标志，表示是否有一个待处理的过渡；startTransition函数，让你将一个状态更新标记为过渡。
* useTransition的目的是让你区分紧急的UI更新和非紧急的UI更新，比如在输入框中输入文字是紧急的，而在输入框下方显示匹配结果是非紧急的。
* useTransition可以配合Suspense和useDeferredValue等特性，实现更流畅和响应式的用户体验。

### React怎么处理错误
React可以使用错误边界（Error Boundary）组件来捕获子组件树中的任何位置的JavaScript错误，并展示一个备用的UI，而不是卸载整个组件树。
React可以使用componentDidCatch或getDerivedStateFromError等生命周期方法来实现错误边界组件，或者使用第三方库如react-error-boundary。

[React 错误处理：最佳实践](https://juejin.cn/post/7207058392287576123)

### React 合成事件
* React合成事件（SyntheticEvent）是React模拟原生DOM事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器。
* React合成事件根据W3C规范来定义，兼容所有浏览器，拥有与浏览器原生事件相同的接口，例如stopPropagation、preventDefault等。
* React合成事件的目的是为了实现全浏览器的一致性，抹平不同浏览器之间的差异性，例如IE和其他浏览器在事件对象和事件绑定上的不同。
* React合成事件使用了事件委托的技术，将所有的事件监听器都绑定到document上，通过判断事件目标来执行对应的回调函数，减少了内存消耗和重复绑定。

### react Hoc 组件
* Hoc 是高阶组件（Higher-Order Component）的缩写，是一种用于复用组件逻辑的高级技巧。
* Hoc 不是一个组件，而是一个函数，它接受一个组件作为参数，并返回一个新的组件，新的组件可以拥有原组件没有的功能或属性。
* Hoc 的目的是让组件之间可以共享代码，避免重复和冗余，提高组件的可维护性和可扩展性。
* Hoc 的实现方式有很多，常见的有属性代理（Props Proxy）和反向继承（Inheritance Inversion），它们分别通过操作props或继承原组件来实现Hoc的功能。

### react  function Component  Class Component
* 编写形式：function component 是一个接受 props 作为参数并返回一个 React 元素的普通 JavaScript 函数，而 class component 需要继承 React.Component 并创建一个 render 函数来返回一个 React 元素。
* 状态管理：在 hooks 出现之前，function component 是无状态组件，不能管理组件的状态，而 class component 可以通过 setState 来更新状态。在 hooks 出现之后，function component 可以通过 useState 来管理状态。
* 生命周期：在 function component 中，并不存在生命周期，这是因为这些生命周期钩子都来自于继承的 React.Component。如果想要使用生命周期，就只能使用 class component。但是 function component 可以通过 useEffect 来实现类似生命周期的功能。
* 调用方式：如果是一个 function component，调用则是执行函数即可，如果是一个 class component，则需要将组件进行实例化，然后调用实例对象的 render 方法。
* 获取渲染的值：function component 和 class component 在获取渲染的值时有不同的行为。function component 能够捕获渲染时的值，而 class component 因为 this 是可变的，所以总是能获取最新的 props。这可能会导致一些意想不到的结果。
