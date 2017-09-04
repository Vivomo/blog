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
说起CSS的布局,大家肯定是接触的非常多的,我们写页面时无时无刻都伴随着的布局,好的布局带来的是简洁的代码,良好的性能与兼容性,更是在页面重构
时省下很多功夫, 下面开门见山,直接看CSS中经典布局与实现吧.
如果您有更好的方案或有静电布局实现的分享, 欢迎在掘金评论区留言, 我会加以改正并附属上您的大名(源码请自行F12控制台查看)

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





