# 有关gulp搭建小项目的总结

```
有时候做一个企业站进行项目构建时不一定需要webpack或其他比较重的构建工具, 这时候gulp就是一个不错的选择
```

### 前端开发项目一般会用到以下几点
* css 编译工具 推荐scss `gulp-sass`
* css css3前缀添加 `gulp-autoprefixer`

* 浏览器自动刷新 `browser-sync`

* JS 压缩 `gulp-uglify`
* es6 -> es5 `gulp-babel`
* 全局替换, 用于不同编译环境 `gulp-replace`
* include html文件用 `gulp-file-include`


### example
```js
let path = {
    input: {
        css: '',
        js: '',
        html: ''    
    },
    output: {
        css: '',
        js: '',
        html: ''
    }   
};
let gulp = require('gulp'),
    scss = require('gulp-sass'),
    babel = require('gulp-babel'),
    prefix = require("gulp-autoprefixer"),
    uglify = require('gulp-uglify'),
    fileinclude = require('gulp-file-include');
gulp.src('scssSrc')
        .pipe(scss({
            outputStyle: 'compressed',
        }))
        .pipe(prefix(["last 2 versions"], { cascade: true }))
        .pipe(gulp.dest('../share/css'));
```