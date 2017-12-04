# 开发环境

## 模块化

### AMD require.js

```js
// 全局define  require
define('name', function() {
    return {};
})

require('name', function(a) {
    // ...
})
```


### CMD

```js
// x.js
module.exports = {
    f: function() {
      
    }
}

// y.js
var x = require('x.js');
module.exports = {
    f: function() {
        x.f();  
    }
}

```


#### 使用场景

```text
需要异步 -> AMD
使用npm之后 -> CMD
```