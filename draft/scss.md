# SCSS 使用简述

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