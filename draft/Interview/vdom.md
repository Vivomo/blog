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