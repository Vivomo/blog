# React Native 踩过的那些坑

# 学习RN 之前
* React的jsx语法
* React的生命周期和渲染原理
```text
以前用angular 或 vue MVVM框架的思想要转变一下, 这个没有双向绑定, 需要深入了解 render函数
```

## 一个RN学习笔记, [地址](https://github.com/crazycodeboy/RNStudyNotes/) 
## react-native 技术栈 & 开发链路总结 [地址](https://jeremyzj.github.io/rnstarter/)
## 一些常用组件库 [地址](http://www.jianshu.com/p/d9cd9a868764)

## 环境搭建(比较简单的方式)
* 用AndroidStudio 来配置安卓环境 (配好在命令行确认下adb是否可执行)
* 模拟器用 Genymotion
* create-react-native-app 来初始化项目 (这是最简单的方式, RN官方推荐) [expo](http://expo.io)这个工具可以让开发省很多事
* Webstorm 开发
* [RN中文文档](https://reactnative.cn)

## 项目规定
* 统一tab size
* 常量定义

## 常用组件注意点
* `TextInput` Android去掉下划线 `underlineColorAndroid='transparent'`
* `Text` 组件默认是不可选的, 建议用他的时候抽成组件, 避免很多地方都要加 `selectable={true}`,
 如果项目已开发了很多又不想一个一个改的话, 可以全局更改(Android和IOS的APP生成者都需要改),
  在`node_modules\react-native\Libraries\Text\Text.js`中的`defaultProps()`里面加`selectable: true`
* Android 设置lineHeight 要避免小数, 否则会造成闪退
* 项目初期就把组件尽量抽取完毕, 抽取了组件就等于抽取了样式(如 分割线, 容器, 各种按钮等), 在多人项目中, 有时组件名比较抽象,可以配一个
    图文代码的文档(建议 .md),以便快速找到需要的组件, 和知道哪些组件没有开发
* 组件中用了未定义的函数, 导致异常不会有明显的提示, Node has not been attached to a View. (eg:xzb)
* 千万不要在RN项目里面用 import * as .... 这种方式 引用组件, 会导致过期不推荐的也被引入, 导致报错(如 react-navigator已替代了react-native里面的Navigator)

## iconfont
利用www.iconfont.com 生成的.ttf 放置对应的资源文件, 在用的时候输入编码,同时声明fontFamily
eg.
```html
<Text style={{fontFamily: 'iconfont'}}>&#xeb6f;</Text>
```

如果以后有更新,更换ttf后要执行 `react-native link`

## 适配

以750px宽度的设计稿为例

```js
import {Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width;      //设备的宽度
const deviceHeight = Dimensions.get('window').height;    //设备的高度
const uiWidthPx = 750;

function pxToDp(uiElementPx) {
    return uiElementPx *  deviceWidth / uiWidthPx;
}
```

一个更好的实践方式是把 `StyleSheet.create` 封装一下, 这个可以省略对每个尺寸的计算
```js
// example
let styleConfig = {
    fontSize: pxToDp,
    width: pxToDp
};

let createStyle = (styleObj) => {
    let style = {};
    Object.entries(styleObj).forEach(([key, value]) => {
        style[key] = styleConfig[key](value) 
    });
    return StyleSheet.create(style);
};

let style = createStyle({
    fontSize: 10,
    width: 200,
})
```

### 盒模型
RN的盒模型相当于CSS中的box-sizing: border-box;


## 其他
```
在第一次 react-native run-Android的时候, 下面那一步比较慢,要耐心等待, (我等了18分钟, 用expo没这问题)
Downloading https://services.gradle.org/distributions/gradle-4.0-milestone-1-all.zip 
```


# 分享朋友圈
```text
http://www.lcode.org/%E8%B6%85%E8%AF%A6%E7%BB%86react-native%E5%AE%9E%E7%8E%B0%E5%BE%AE%E4%BF%A1%E5%A5%BD%E5%8F%8B%E6%9C%8B%E5%8F%8B%E5%9C%88%E5%88%86%E4%BA%AB%E5%8A%9F%E8%83%BD-androidios%E5%8F%8C%E5%B9%B3%E5%8F%B0/
```

# 动画参考

```text
https://www.jianshu.com/p/3ce1d27fc246 LayoutAnimation
https://www.jianshu.com/p/2532c0e99c85 Animated
```

# react native 字体不随系统字体变化而变
```text
https://www.jianshu.com/p/bb09b917dadc
上述链接只适合比较老的RN版本
在使用.51后. 发现 只要Text设置 allowFontScaling=false 即可, 以前是只有IOS支持
.51不是明确的版本分割, 具体看官方文档(非翻译版)
```