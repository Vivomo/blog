# npm 常用指令

> 切换镜像
```
# 默认源
npm config set registry https://registry.npmjs.org

# https -> http，这样网速就会好很多
npm config set registry http://registry.npmjs.org 

淘宝源
npm set registry https://registry.npm.taobao.org

```

> 使用nrm快速切换npm源
```text
npm install -g nrm
```
切换：
```
nrm use taobao
->
Registry has been set to: http://registry.npm.taobao.org/
```
增加源：
```
nrm add <registry> <url> [home]
```
列出可用的源：
```
  ➜  ~  nrm ls
  npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
  taobao - http://registry.npm.taobao.org/
  eu ----- http://registry.npmjs.eu/
  au ----- http://registry.npmjs.org.au/
  sl ----- http://npm.strongloop.com/
  nj ----- https://registry.nodejitsu.com/
  pt ----- http://registry.npmjs.pt/
```
删除源：
```
nrm del <registry>
```
测试速度：
```
nrm test
```