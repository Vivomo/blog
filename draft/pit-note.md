# 爬坑笔记
```text
记录自己爬过的那些坑, 一般是指耽误在上面的时间长, 真正找到问题所在后又很快解决的问题
```

* RDS构建问题, 迟迟无法构建成功, => npm install 的源切制淘宝
```
# RDS node 基础构建
code.language=nodejs

build.command=npm --python=/usr/alibaba/install/python-3.5.0/bin/python3 --registry=https://registry.npm.taobao.org install --production

build.output=www/
``` 

* vue项目中第三方样式无法覆盖
```
如mt-ui, 覆盖的样式不要写在scope里面就好了
```

* webpack本地服务可以访问 localhost:port 但不能访问 本地路由IP:port
```
script
"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --port 8080 --host 0.0.0.0",
```

* ios 不支持window.outerHeight  用 window.innerHeight 代替

* Vue-loader 在dev上不能转es5 可以不用管, 只要build可以就好了
```
有的时候dev上的问题可以对比下build之后
```
