# 微信小程序的旅途
> 项目体积不能超过2M (2018-5-2)

> 不支持SVG 

> 不支持iconfont

> canvas 无非被元素覆盖 (zIndex突破天际)

> scroll-view 里面不能放canvas; 里面的input blur 会有文字不显示问题
``` 
input blur 后, 可以手动去改下scrollTop 强制让其重绘
```

> 路径跳转要考虑嵌套层级
``` 
navigateTo 增加一个层级, 可以back
redirectTo 新开页面清空历史层级 不能back
历史层级不能超过10 (2018-5-2)
```

> 有时候JS报错不会在控制台显示, 尤其是异步代码的错误 (EsLint 很重要)
``` 
开发中遇到过引用JS未定义变量但console log 未提示的情况, 这种低级错误可由IDE配合ESlint规避
```

> CSS 图片做背景只能用base64, 在某些button上会有显示问题(如 share button), 这时候推荐image 套个label

> 图片相对于浏览器的img不能让其自适应宽高, 总得设点什么 (参照image组件)

> 图片在部分安卓机型下 不能动态获取宽高, 如果要做瀑布流效果要注意
```js
// 这种情况,可以让后端配合把图片的宽高信息保留在服务端
wx.getImageInfo({
    src: 'src url',
    success: (res) => {
        // 有bug的机型得到的宽高是-1
        let {width, height} = res;
    }
});
```
> 按钮border如果去不掉 就加个 `button:after{border: 0}` (脑残的设计)

> 通过选择器获取wxml的属性都是异步只读的 (2018-5-2)

> 某些写起来不爽的API 可以推荐封装一下, 可以方便非微信IDE的代码自动提示
``` 
// 如request, Toast, navigator, storage...
```
> 公共地方是抽取 Component还是template 需要斟酌一下
``` 
component 更适合内部维护状态 和外面耦合较少的情况
template 用起来更简单 事件绑定成本较低
通常来讲 写一个Component成本更高一点
```
