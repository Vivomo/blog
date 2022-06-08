# 性能优化

WPOStats 性能优化案例库 - 业界经验

## 性能指标 & 优化目标

* 加载瀑布图
* HAR 存储
* Chrome Lighthouse 跑分
* ctrl+shift+p 搜索frame （小工具）

## RAIL 测量模型

* Response
* Animation
* Idle
* Load

## RAIL 评估标准

* 响应：处理事件 50ms 以内 （google 问卷得来-- 100ms， 留50ms给浏览器响应）
* 动画：每10ms/frame （留6ms给浏览器绘制和渲染）
* 空闲： 尽可能增加空闲时间
* 加载：在5s内完成内容的加载并可以交互

## 性能测量工具
* Chrome DevTool 开发调试、性能评测
* LightHouse 网站整体质量评估
* WebPageTest多测试地点、全面性能报告 （可本地部署）

## Chrome DevTool
* 资源 如果两个体积相等说明没有走压缩， 需要让后端配置Gzip

## 性能测试API

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

