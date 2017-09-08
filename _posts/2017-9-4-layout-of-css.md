---
layout: blog
title: 基础——重中之重之CSS中的布局
description: CSS中的经典布局
keywords: CSS布局,垂直居中,水平居中,自适应布局,栅格布局
---
<style>
        .window {
            margin: 10px;
            width: 200px;
            height: 60px;
            box-shadow: 0 0 3px #000;
        }

        .v-window {
            margin: 10px;
            height: 200px;
            width: 60px;
            box-shadow: 0 0 3px #000;
        }

        .relative {
            position: relative;
        }

        .absolute {
            position: absolute;
        }

        .flex {
            display: flex;
        }

        .table {
            display: table;
        }

        .table-cell {
            display: table-cell;
        }

        .v-center-after:after{
            content: " ";
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }

        .fl {
            float: left;
        }

        .fr {
            float: right;
        }

        .content {
            width: 60px;
            height: 60px;
            background: #999;
            box-shadow: 0 0 10px #fff inset;
        }

    </style>

```
说起CSS的布局,大家肯定是接触的非常多的,我们写页面时无时无刻都伴随着的布局,好的布局带来的是简洁的代码,良好的性能与兼容性,更是在页面重构
时省下很多功夫, 下面开门见山,直接看CSS中经典布局与实现吧.
如果您有更好的方案或有静电布局实现的分享, 欢迎在评论区留言, 我会加以改正并附属上您的大名(源码请自行F12控制台查看)
```

## 水平居中

关于`margin: 0 auto;` 会可以居中的原理可以查看 [地址](https://www.w3.org/TR/CSS2/visudet.html#blockwidth)

### block元素居中
<div class="window">
    <div class="content" style="margin: 0 auto"></div>
</div>

### inline-block元素居中
<div class="window" style="text-align: center">
    <button>button</button>
</div>

### inline元素居中
<div class="window" style="text-align: center">
    <span>span</span>
</div>

### 一个古老的居中方式(不推荐)
<div class="window" >
    <div style="position: relative; left: 50%; float: left">
        <span style="left: -50%; position: relative;">some word</span>
    </div>
</div>

### 定宽绝对定位的元素 +margin
<div class="window relative">
    <div class="absolute content" style="left: 50%; margin-left: -30px"></div>
</div>

### 绝对定位的元素 +transform
<div class="window relative">
    <div class="absolute content" style="left: 50%; transform: translate(-50%, 0)"></div>
</div>

### flex式
<div class="window flex" style="justify-content: center">
    <div class="content"></div>
</div>

## 垂直居中

### absolute且高度固定 的元素
<div class="v-window relative">
    <div class="content" style="margin: auto 0; position: absolute; top: 0; bottom: 0;"></div>
</div>

### table-cell(注意此时父级元素高度必须是明确的, 不能是百分比的)
<div class="v-window table-cell" style="vertical-align: middle">
    <div class="content"></div>
</div>

### 单行文字用行高来居中(适合场景导航栏)
<div class="v-window">
    <span style="line-height: 200px">1234</span>
</div>

### 这种方法自己的宽度不能超过父级, (我也不知道为啥)
<div class="v-window v-center-after">
    <div style="display: inline-block">000</div>
</div>

### by transform
<div class="v-window relative">
    <div class="absolute content" style="top: 50%; transform: translate(0, -50%)"></div>
</div>

### by flex
<div class="v-window flex" style="align-items: center">
    <div class="content"></div>
</div>

```
关于垂直水平居中可以通过上面列举的方式根据情况组合出来, 这里就不啰嗦了, 否则就是一个笛卡尔积式的blog
```

## 各种各样的自适应

### 边距固定,宽高自适应
<div class="window relative">
    <div class="absolute" style="left: 10px; right: 10px; top: 10px; bottom: 10px; background: #aaa"></div>
</div>

### 左固定, 右自适应 by float
<div class="window">
    <div class="content fl"></div>
    <div style="background: #aaa; height: 60px; margin-left: 60px"></div>
</div>

### 左固定, 右自适应 by flex
<div class="window flex">
    <div class="content"></div>
    <div style="background: #aaa; height: 60px; flex: 1 1 auto;"></div>
</div>

### 三列布局 左右固定, 中间适应 by float
<div class="window">
    <div class="content fr"></div>
    <div class="content fl"></div>
    <div style="background: #aaa; height: 60px; margin-left: 60px; margin-right: 60px"></div>
</div>

### 三列布局 左右固定, 中间适应 by flex
<div class="window flex">
    <div class="content"></div>
    <div style="background: #aaa; height: 60px; flex: 1 1 auto;"></div>
    <div class="content"></div>
</div>

## 等分布局

### table-cell
<div class="window table">
    <div class="content table-cell"></div>
    <div class="content table-cell"></div>
    <div class="content table-cell"></div>
    <div class="content table-cell"></div>
    <div class="content table-cell"></div>
</div>

```
flex 没有写兼容代码, 你可以通过工具是生成兼容性的CSS
暂时想到了这么多, 有建议欢迎留言
The end
```

