---
layout: blog
title: 页面滚动条出现时不抖动实践与相关问题
description: 页面滚动条出现时不抖动实践与相关问题
keywords: 滚动条出现时不抖动 css技巧
---

本文主要由两部分组成,

一是对张鑫旭一篇博客的精简, 博客地址[小tip:CSS vw让overflow:auto页面滚动条出现时不跳动](https://www.zhangxinxu.com/wordpress/2015/01/css-page-scrollbar-toggle-center-no-jumping/)

二是在实际使用过程中遇到问题与解决, 如果其他人还遇到了其他问题, 欢迎一起分享补充

### 一、博客精简

#### 1.对于高度确认肯定会超过一屏的页面(如淘宝首页)， 可以直接让其总是有滚动条只需
```css
body { overflow-y: scroll; }
```

#### 2.CSS3计算calc和vw单位巧妙实现滚动条出现页面不跳动
```css
.wrap-outer {
    margin-left: calc(100vw - 100%);
}
/*或者*/
.wrap-outer {
    padding-left: calc(100vw - 100%);
}
```

首先，.wrap-outer指的是居中定宽主体的父级，如果没有，创建一个（使用主体也是可以实现类似效果，不过本着宽度分离原则，不推荐）；
然后，calc是CSS3中的计算，IE10+浏览器支持，IE9浏览器基本支持(不能用在background-position上)；
最后，100vw相对于浏览器的window.innerWidth，是浏览器的内部宽度，注意，滚动条宽度也计算在内！而100%是可用宽度，是不含滚动条的宽度。
于是，calc(100vw - 100%)就是浏览器滚动条的宽度大小（如果有，如果没有滚动条则是0）！左右都有一个滚动条宽度（或都是0）被占用，主体内容就可以永远居中浏览器啦，从而没有任何跳动！

窄屏幕宽度下的处理
上面CSS还是有一点瑕疵的，浏览器宽度比较小的时候，左侧留的白明显与右边多，说不定会显得有点傻。此时，可能需要做点响应式处理会更好一点：
```css
@media screen and (min-width: 1150px) {
   .wrap-outer {
       margin-left: calc(100vw - 100%);
   }
}
```

#### 3.经过一些大项目的终极方案
```css
html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}
```

### 二、项目中可能遇到的问题
#### 1.fixed定位的元素， 如果left设置的%值会出现抖动，对于fixed的元素，%计算是参照屏幕左侧到滚动条左边界的距离，所以出现滚动条时，会导致其计算宽度发生变化,解决方法是%换成vw，
```css
/*eg*/
.fixed-elem { position: fixed; left: 50%}
/*改为*/
.fixed-elem { position: fixed; left: 50vw}

```

#### 2.使用第三种方案时, 注意html, body 不要设置height:100% 
有需要的场景可以给body的子集元素(如 react root elem)设置 min-height: 100vh, 这样就可以撑满屏幕

#### 3... 欢迎补充
