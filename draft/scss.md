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
　　hi {
　　　　color:red;
　　}
}
属性也可嵌套(用的较少)
p {
　　border: {
　　　　color: red;
　　}
}
在嵌套的代码块内，可以使用&引用父元素。比如a:hover伪类，可以写成：
a {
　　&:hover { color: #ffb3ff; }
}
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