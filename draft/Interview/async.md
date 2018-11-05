### 什么是单线程，和异步的关系

```text
单线程 - 只有一个线程，只能做一件事单
线程在程序执行时，所走的程序路径按照连续顺序排下来，前面的必须处理好，后面的才会执行。
原因 - 避免 DOM 渲染的冲突
解决方案 - 异步
但异步存在一些问题
1.可读性差
2.callback 不好模块化

```

### event-loop
```text
事件轮询，JS 实现异步的具体解决方案
同步代码，直接执行
异步函数先放在 异步队列中(立即放入, 执行一段时间后放入, ajax执行完后放入)
待同步函数执行完毕，轮询执行 异步队列 的函数
```

### jQuery-deferred
```text
jQ 1.5版本后(2011年1月) 新增deferred

无法改变 JS 异步和单线程的本质
只能从写法上杜绝 callback 这种形式
它是一种语法糖形式，但是解耦了代码
很好的体现：开放封闭原则(对扩展开放，而对修改封闭)

```

```js
function waitHandle() {
    // 定义
    var dtd = $.Deferred()
    var wait = function (dtd) {
        var task = function () {
            console.log('执行完成')
            // 成功
            dtd.resolve()
            // 失败
            // dtd.reject()
        }
        setTimeout(task, 1000)
        // wait 返回
        return dtd.promise()
    }
    // 最终返回
    return wait(dtd)
}

// 使用（B 员工）
$.when(waitHandle()).then(function () {
    console.log('ok 1')
}, function () {
    console.log('err 1')
})
```