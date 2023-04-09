---
layout: blog
title: 关于前端优化(更新中...)
tags: text
---

### 前端性能优化指标 RAIL

#### RAIL 测量模型

* Response
* Animation
* Idle
* Load

#### RAIL 评估标准

* 响应：处理事件 50ms 以内 （google 问卷得来-- 100ms， 留50ms给浏览器响应）
* 动画：每10ms/frame （留6ms给浏览器绘制和渲染）
* 空闲： 尽可能增加空闲时间
* 加载：在5s内完成内容的加载并可以交互

### 性能测量工具
* Chrome DevTool 开发调试、性能评测
* LightHouse 网站整体质量评估
* WebPageTest多测试地点、全面性能报告 （可本地部署）

### 性能测试API
#### Performance API
* Performance API是一组用于衡量web应用性能的标准，提供了一些重要的内置指标，并能够将自定义的测量结果添加到浏览器的性能时间线中。
* Performance API使用高精度的时间戳，可以在开发者工具中显示，也可以将相关数据发送到用于分析的端点，以根据时间记录性能指标。
* Performance API包含一组高精度时间定义，以及配套的接口和方法，如Performance、PerformanceEntry、PerformanceObserver、PerformanceNavigationTiming、PerformanceResourceTiming等。
* Performance API可以测量页面中的各种性能指标，如白屏时间、首屏时间、用户可操作的时间节点、页面总下载的时间、DNS查询的时间、TCP链接的时间等。

[Performance - Web API 接口参考 | MDN - Mozilla Developer](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API)

```js
// 计算一些关键的性能指标
window.addEventListener('load', (event) => {
    // Time to Interactive
    let timing = performance.getEntriesByType('navigation')[0];
    console.log(timing.domInteractive);
    console.log(timing.fetchStart);
    let diff = timing.domInteractive - timing.fetchStart;
    console.log("TTI: " + diff);
})
```

```js
// 观察长任务
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(entry)
    }
})

observer.observe({entryTypes: ['longtask']})
```

```js
// 见面可见性的状态监听
let vEvent = 'visibilitychange';
if (document.webkitHidden != undefined) {
    // webkit prefix detected
    vEvent = 'webkitvisibilitychange';
}

function visibilityChanged() {
    if (document.hidden || document.webkitHidden) {
        console.log("Web page is hidden.")
    } else {
        console.log("Web page is visible.")
    }
}

document.addEventListener(vEvent, visibilityChanged, false);
```

```js
// 网络状态
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

function updateConnectionStatus() {
  console.log("Connection type changed from " + type + " to " + connection.effectiveType);
  type = connection.effectiveType;
}

connection.addEventListener('change', updateConnectionStatus);
```

### 为什么会出现白屏?
白屏时间指的是浏览器开始显示内容的时间，因此，我们通常认为浏览器开始渲染 `<body>` 标签或者解析完 `<head>` 标签的时刻就是页面白屏结束的时间点。

通常白屏是以下原因导致的：
* 打包后的js和css文件过大，导致浏览器加载时间过长，渲染页面之前显示空白。
* 低版本的浏览器或webview不支持某些语法，导致js执行出错，渲染页面失败。
* 前端代码中存在未捕获的异常，导致渲染过程中断，页面显示空白。
* 首屏无实际的数据内容，等待异步加载数据再渲染页面导致白屏。

### 检测页面白屏时长
* 使用Performance API中的navigationStart和firstPaint属性，计算两者的时间差，即为白屏时长。
* 使用Performance API中的getEntriesByType方法，获取type为paint的性能条目，其中startTime属性即为白屏时长。
* 使用PerformanceObserver API，监听paint类型的性能条目，其中startTime属性即为白屏时长。

### 如何优化 canvas 性能
* 使用requestAnimationFrame代替setInterval或setTimeout来实现动画，可以保持最佳绘制效率，避免卡顿或掉帧。
* 使用离屏canvas来缓存静态或复杂的图形，避免重复绘制，提高渲染速度。
* 使用合理的图形大小和数量，避免绘制过大或过多的图形，造成内存占用过高或绘制时间过长。
* 使用整数坐标而不是浮点数坐标，避免浏览器为了达到抗锯齿的效果做额外的运算。
* 使用CSS transform代替canvas计算缩放，利用GPU加速，提高性能。
* 用CSS设置大的背景图
* 关闭透明度
[developer.mozilla.org-canvas 的优化](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

### React 优化
* 使用生产版本的React库，避免开发版本中的警告信息和额外的检查，提高性能。
* 使用Chrome Performance标签或React DevTools分析器来分析组件的渲染时间和性能瓶颈。
* 使用shouldComponentUpdate或React.memo来避免不必要的组件重新渲染，减少Virtual DOM对比的次数。
* 使用useCallback或useMemo来缓存函数或数据，避免引起子组件的重新渲染。
* 使用PureComponent或React.memo来优化类组件或函数组件，只在props或state发生浅层变化时才重新渲染。
* 使用webpack或vite等工具进行打包配置，减少js和css文件的体积，使用gzip压缩、cdn加速、代码分割等技术提高加载速度。
* 使用骨架屏或loading动画等方式提升用户体验，避免用户看到空白页面 。
* 大组件用LazyLoad

### JIT 优化
* JIT是Just In Time的缩写，也就是即时编译器，是一种在运行时将字节码或源代码转换为机器码的技术，可以提高程序的执行效率。
* JIT优化是指JIT编译器在编译过程中对代码进行分析和优化，以生成更高质量的机器码，减少运行时的开销。
* JIT优化的方法有很多，例如内联、数据流分析、循环优化、逃逸分析、同步优化等。
* JIT优化的难点在于如何平衡编译时间和执行时间，以及如何处理动态变化的代码。
[A crash course in just-in-time (JIT) compilers](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/)

### 为什么 ESBuild 会那么快
* ESBuild是用Go语言编写的，并可以编译为本地代码，而大多数打包工具都是用JavaScript编写的，对于命令行应用程序来说，Go语言有更高的性能优势。
* ESBuild使用了并行处理的技术，利用多核CPU的优势，同时处理多个文件，提高了打包速度。
* ESBuild使用了自定义的解析器和打包器，避免了使用第三方库带来的额外开销，也减少了不必要的抽象和中间层。
* ESBuild使用了一些简化和近似的策略，比如忽略注释和空白字符，不支持source map和HMR等功能，牺牲了一些精确性和功能性，换取了更快的速度。
[Esbuild 为什么那么快 - 知乎](https://zhuanlan.zhihu.com/p/379164359)