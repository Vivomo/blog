# 获取一个URL的search, 转成对象返回

把链接的search转成一个对象, 原生也有相应的方法. 不过和下面的工具函数有些区别, 下面的函数更强大一些

```js
const getUrlSearchMap = (url) => {
    let search;
    if (url !== undefined) {
        let hashIndex = url.lastIndexOf('#');
        let searchIndex = url.lastIndexOf('?');
        if (searchIndex !== -1) {
            search = hashIndex === -1 ?
                url.substr(searchIndex + 1)
                :
                url.substring(searchIndex, hashIndex);
 
        } else if (hashIndex !== -1) {
            search = url.substr(hashIndex + 1);
        } else {
            return {};
        }
    } else {
        search = window.location.search;
    }
    if (!search) {
        return {};
    }
 
    let hashArr = search.replace('?', '').split('&');
    let hashMap = {};
    for (let i = 0; i < hashArr.length; i++) {
        let tempArr = hashArr[i].split('='),
            k = tempArr[0],
            v = tempArr[1] || true;
        if (hashMap[k]) {
            if (Array.isArray(hashMap[k])) {
                hashMap[k].push(v);
            } else {
                hashMap[k] = [hashMap[k], v];
            }
        } else {
            hashMap[k] = v;
        }
    }
    return hashMap;
};
```

Example
```js
getUrlSearchMap(); // 不传值默认取location.search
getUrlSearchMap('http://www.leke.cn?a=1&b=2&b=3&c#d=1'); // {a: '1', b: ['2', '3'], c: true}
```

## 原生的方法
```js
let params = (new URL(document.location)).searchParams;
let name = params.get("name"); // "Jonathan"
let age = parseInt(params.get("age")); // 18
```

## *注意事项
```text
1.原生方法不兼容IE 需要 npm i url-polyfill --save

2.当有多个相同参数时不会转化为数组, 只会返回第一个, 没有=值的当做空字符串

let params = (new URL('http://www.leke.cn?a=1&b=2&b=3&c')).searchParams;
let b = params.get("b"); // "3"
let c = params.get("c"); // ""
暂时只发现这些不同
```
