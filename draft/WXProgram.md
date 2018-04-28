# 微信小程序的旅途
> 项目体积不能超过2M

> 不支持SVG

> canvas 无非被元素覆盖 (zIndex突破天际)

> scroll-view 里面不能放canvas; 里面的input blur 会有文字不显示问题
``` 
input blur 后, 可以手动去改下scrollTop 强制让其重绘
```

> 路径跳转要考虑嵌套层级
``` 
navigateTo 增加一个层级, 可以back
redirectTo 新开页面清空历史层级 不能back
历史层级不能超过10 (2018-4-27)
```

> 有时候JS报错不会在控制台显示, 尤其是异步代码的错误 (EsLint 很重要)

> CSS 图片做背景只能用base64, 在某些button上会有显示问题, 这时候推荐image 套个label

> 图片不能让其自适应宽高, 总得设点什么 (参照image组件)

> 某些写起来不爽的API 可以推荐封装一下
``` 
// 如request, Toast, navigator, storage...
```
> 公共地方是抽取 Component还是template 需要斟酌一下
``` 
component 更适合内部维护状态 和外面耦合较少的情况
template 用起来更简单 事件绑定成本较低
```


