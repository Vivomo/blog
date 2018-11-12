---
layout: blog
title: 高性能网站建设指南总结
description: 总结一下 高性能网站建设指南 这本书的主要知识点
keywords: 高性能网站 网站性能优化
---

### 1.减少HTTP请求
* 图片地图
```html
<!-- example -->
<img src="http://a.a.jpg" alt="" usemap="#map1">
<map name="map1">
    <area shape="rect" coords="0, 0, 20, 20" href="http://google.com" title="google">
    <area shape="rect" coords="20, 20, 40, 40" href="http://google.com" title="google1">
</map>
```
* CSS Sprite
* 内联图片 `data:[<mediatype>][;base64],<data>`
* 合并脚本和样式表
