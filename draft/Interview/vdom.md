### 什么是 vdom
```text
virtual dom ， 虚拟 DOM
用 JS 模拟 DOM 结构
DOM 变化的对比，放在 JS 层来做（图灵完备语言）
提高重绘性能

```

### 为何使用vdom
```text
DOM 操作是“昂贵”的，js 运行效率高
尽量减少 DOM 操作，而不是“推倒重来”
项目越复杂，影响就越严重
vdom 即可解决这个问题

```

### snabbdom
```text
核心API 
h 生成vnode
h(‘<标签名>’, {…属性…}, […子元素…])
h(‘<标签名>’, {…属性…}, ‘….’)

patch 把vnode生成到dom中
patch(container, vnode) 
patch(vnode, newVnode) 

```

### diff算法
```text
linux的一个命令, 比较文件的
git diff是查看一个文件变化的命 
vdom中 是为了找出需要更新的节点
```

### react vue diff 算法
相同点：React 和 Vue 的 diff 算法，都是不进行跨层级比较，只做同级比较。
不同点：
Vue 进行 diff 时，调用 patch 打补丁函数，一边比较一边给真实的 DOM 打补丁。Vue 对比节点时，当节点元素类型相同，但是类名不同时，认为是不同类型的元素，删除重新创建，而 React 则认为是同类型节点，进行修改操作。
Vue 的列表比对，采用从两端到中间的方式，旧集合和新集合两端各存在两个指针，两两进行比较，如果匹配上了就按照新集合去调整旧集合，每次对比结束后，指针向队列中间移动。而 React 则是从左到右依次比对。
React 的 diff 将节点分为三种：元素节点、组件节点和文本节点，并分别采用不同的策略进行比较。React 的 diff 还使用了 key 属性来优化列表渲染的性能。
