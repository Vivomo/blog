# CSS 选择器

## 知识点
* 概述
```
css选择器涉及到视觉表现, 用户安全和用户体验
```

* 权重
```text
类, 属性选择器, 伪类的权重是一样的
```

## 实践

* 无效选择器
```css
/* 在不支持:focus-within的浏览器会导致前面的:hover也失效 */
.a:hover, .a:focus-within {color: red}
```
* 增强选择器优先级可以重复选择自身
```css
.a.a{}
.a[class]
```
* 省略标签选择器的情况
```css
/*很多原生属性是某些标签特有的*/
input[type="radio"] {}
/*省略为*/
[type="radio"] {}
```
* :hover 延时, 体验优化
* :active 埋点
* :only-child 子节点
* TODO 命名与实践
* :focus 无障碍体验
* TODO :target 与阅读更多的的相关实践
* TODO Material Design placeholder-shown
* TODO 表单的伪类
* TODO 动态列表
## 疑点

* attachShadow 
* document.querySelector('').querySelector('div div') 
* :focus-within