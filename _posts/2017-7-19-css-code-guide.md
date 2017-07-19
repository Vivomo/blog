---
layout: blog
title: CSS 编程规范
description: CSS 编程规范
keywords: CSS 编程规范
---

### CSS语法规范

>* 自定义组件的要有一个统一的前缀, 如ant design的是`ant`
>* 禁止使用第三方组件封装的类名覆盖样式, 如`.ant-input{border:0}` . 除非组件没有暴露className属性拓展
>* 禁用id写样式, 避免权重过高导致一些样式覆盖操作困难(除非绝对有需要)
>* 不要为 0 指明单位，比如使用 `margin: 0;`
>* 属性尽量简写 如`background, font, margin` [参考文章](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)
>* 避免不必要的嵌套。可以进行嵌套，不意味着你应该这样做。只有在需要给父元素增加样式并且同时存在多个子元素时才需要考虑嵌套。
>* 对于可能涉及到重构的数值或用于计算的数值则用变量保存(`LESS/SASS`), 如`padding-top: @scrollNavHeight;` 不推荐`height: calc(~'100% - 80px');`
>* 属性声明顺序, 以此来优化渲染性能
>>* Positioning
>>* Box model 盒模型
>>* Typographic 排版
>>* Visual 外观

### Class命名
>* 保持 Class 命名为全小写，可以使用短划线（不要使用下划线和 camelCase 命名）。短划线应该作为相关类的自然间断。(例如，.btn 和 .btn-danger)。
>* 避免过度使用简写。除了公认的缩写，其余都应该使用完整单词。同时禁止使用拼音.btn 可以很好地描述 button，但是 .s 不能代表任何元素。
>* 使用有意义的名称；使用结构化或者作用目标相关，而不是抽象的名称。
>* 命名时使用最近的父节点或者父 class 作为前缀。
>* 使用 .js-* classes 来表示行为(相对于样式)，但是不要在 CSS 中定义这些 classes。

### 选择器
>* 使用 classes 而不是通用元素标签来优化渲染性能。
>* 避免在经常出现的组件中使用一些属性选择器 (例如，`[class^="..."]`)。浏览器性能会受到这些情况的影响。
>* 减少选择器的长度，每个组合选择器选择器的条目应该尽量控制在 3 个以内。
>* 只在必要的情况下使用后代选择器 (例如，没有使用带前缀 classes 的情况).