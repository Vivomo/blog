# React Native 踩过的那些坑

## 环境搭建(比较简单的方式)
* 用AndroidStudio 来配置安卓环境
* 模拟器用 Genymotion
* Webstorm 开发
* [RN中文文档](https://reactnative.cn/docs/0.47/getting-started.html)

## 项目规定
* 统一tab
* 常量定义

## 常用组件注意点
* `TextInput` Android去掉下划线 `underlineColorAndroid='transparent'`
* Android 设置lineHeight 要避免小数, 否则会造成闪退
* 项目初期就把组件尽量抽取完毕, 抽取了组件就等于抽取了样式(如 分割线, 容器, 各种按钮等)
