#### css 中的 link 和 @import 的区别
* link是HTML提供的标签，不仅可以加载CSS文件，还可以定义RSS、rel连接属性等；@import是CSS提供的语法规则，只有导入样式表的作用。
* link标签引入的CSS被同时加载；@import引入的CSS将在页面加载完毕后被加载。
* link没有兼容性问题；@import是CSS2.1才有的语法，所以只能在IE5以上才能识别。
* link方式的样式权重高于@import的权重。

#### CSS 3D 加速
* 3D加速是一种利用GPU（图形处理器）来渲染页面元素的技术，可以提高网站的性能和流畅度。
* 3D加速依赖于浏览器渲染页面时使用的分层模型，当对页面上的元素进行某些操作（比如3D变换）时，该元素会被移动到属于它自己的“图层”，在那里它可以独立于页面的其他部分进行渲染，并在之后被合成（画到屏幕上）。
* 3D加速可以通过使用特定的CSS属性或函数来开启，比如使用transform: translateZ(0)、transform: translate3d()、will-change等，这样可以告诉浏览器该元素需要GPU加速。

#### css 变量的理解
// TODO

#### 什么是响应式布局? 如何实现?

响应式布局是指一种网页设计的方法，使得同一个网页能够根据不同的设备和屏幕尺寸，自动调整布局和显示效果，以适应不同的浏览环境¹²³。

响应式布局的实现方式有以下几种：

- **使用百分比布局**：百分比布局是指使用百分比来设置元素的宽度、高度、边距等属性，使得元素的尺寸能够相对于父元素或视口进行缩放，例如：

```css
.container {
  width: 80%;
  margin: 0 auto;
}
```

- **使用媒体查询**：媒体查询是指使用 @media 规则来根据不同的媒体类型和特征，为不同的设备或屏幕尺寸设置不同的样式，例如：

```css
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
  }
}
```

- **使用弹性布局**：弹性布局是指使用 flexbox 模型来设置元素的排列方式和对齐方式，使得元素能够在不同的方向上进行伸缩和分配空间，例如：

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1;
}
```

- **使用网格布局**：网格布局是指使用 grid 模型来将容器划分为多个网格单元，并将子元素放置在不同的网格单元中，使得元素能够在二维空间上进行定位和排列，例如：

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.item {
  grid-column: span 2;
}
```

- **使用视口单位**：视口单位是指使用 vw、vh、vmin、vmax 等单位来设置元素的尺寸，使得元素能够相对于视口的宽度或高度进行缩放，例如：

```css
.container {
  width: 50vw;
  height: 50vh;
}
```

