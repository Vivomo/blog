# React Native 踩过的那些坑

## 一个RN学习笔记, [地址](https://github.com/crazycodeboy/RNStudyNotes/) 

## 环境搭建(比较简单的方式)
* 用AndroidStudio 来配置安卓环境
* 模拟器用 Genymotion
* Webstorm 开发
* [RN中文文档](https://reactnative.cn/docs/0.47/getting-started.html)

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

### 盒模型
RN的盒模型相当于CSS中的box-sizing: border-box;
