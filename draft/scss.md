# SCSS 使用简述

### 变量的定义与使用
```
$blue: #00f;
$size: 12;
div {
    font-size: #{$size}px;
    color: $blue;
}
```

### SCSS中的计算
``` 
body {
    margin: (14px/2);
    top: 50px + 100px;
    right: $var * 10%;
}
```

### 嵌套
``` 
div {
　　h1 {
　　　　color:red;
　　}
}
属性也可嵌套(用的较少)
div {
　　border: {
　　　　color: red;
　　}
}
在嵌套的代码块内，可以使用&引用父元素。比如a:hover伪类，可以写成：
a {
　　&:hover { color: #f00; }
}
```
### 继承
``` 
.super {
    color: red;
}
.sub {
    @extend .super;
    font-size: 12px;
}
```
### Mixin, 类似于C的宏
```
// 我常用的省略号

//定义了一个含参数和默认值的mixin, 没参数可以省略括号
@mixin ellipsis($line:1){
    overflow: hidden;
    text-overflow: ellipsis;
	@if $line == 1{
		white-space: nowrap;
		word-wrap: normal;
	} @else {
		display: -webkit-box;
		-webkit-line-clamp: $line;
		-webkit-box-orient: vertical;
	}

}

// 使用
.title {
    @include ellipsis;
}
.content {
    @include ellipsis(3); // 3行省略
}
```

### 内置函数 (目前没有三角函数, 郁闷)
```
// 如颜色的
lighten(#cc3, 10%) // #d6d65c
darken(#cc3, 10%) // #a3a329
grayscale(#cc3) // #808080
complement(#cc3) // #33c
```

### 引入css
```
// 本地文件
@import "filepath";
// 第三方文件
@import url("file's url")
```

### for使用示例
```text
// 生成 .f12 {font-size: 12px} .... .f30 {font-size: 30px}
@for $i from 12 through 30 {
  .f#{$i} {
    font-size: #{$i}px;
  }
}
```