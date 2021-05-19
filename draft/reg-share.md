# 正则表达式
## 1.基础部分

* \d
* \w
* \s
* \b …. + * 略
---------------------
* `\w`包含下划线
* 元字符的转义, 在`[]`中只有`-`才是元字符,需要转义. 例子: /\+-/ /[+\-]/
* `$1` 与`\1` 'aabbab'.replace(/(a)(b)\2\1/, '$1') => 'aab'
* `(?:…)`非捕获型括号, 例如 'abcde'.match(/(?:a)(b)(c)/) => `["abc", "b", "c", index: 0, input: "abcde", groups: undefined]`
* `(?<name>)` 命名捕获 'abcde'.match(/(?<o>a)(b)/) => `['ab', 'a', 'b']`arr, 此时arr还有一个groups属性, 值为 `{o: 'a'}`
* 环视(?:=) 不占空间 例子: '23456789'.replace(/(\d)(?=(\d\d\d)+$)/g, '$1,') => '23,456,789'
* (?!...) 与上相反


## 2.JS对正则的支持

* 正则不属于某种语言,而是看语言对正则的支持程度
* JS中和正则相关的API
* Regex 对象 exec / test
* String 对象 search / match / replace / split
* ES6 新增两种修饰符 u 和 y
> u 使用unicode码的模式进行匹配, emoji表情 (https://zh.javascript.info/regexp-unicode)
> y 执行“粘性(sticky)”搜索,匹配从目标字符串的当前位置开始。lastIndex位置

不支持的规则
* `(?<=)` Python
* `[[a-z]-[c-f]]` 区间减法 .net
* `(?#...)` VB 添加注释
* 等等...

## 3.正则引擎的分类与构造

* DFA 不支持捕获型括号, awk(文本处理工具),  Mysql
* NFA (JS等多数编程语言) 支持忽略优先量词
* POSIX NFA
* DFA / NFA 混合

引擎的分类是由以下几个零件的组合方式锁决定的
* 文字文本
* 字符组
* 捕获型括号
* 锚点

## 4.如何打造高效的正则表达式

高效的东西思路都是相通的, 
高效正则的主要核心是减少回溯和增加精确性

  
#### 精确性
* 长度判断优化
* 锚点优化
* 消除不必要的括号,字符组

#### 减少回溯
* 多选分支的调序 `/([\u0255-\u6500]|\w)/`
* 提取多选结构的开头 `(?:this|that)`  => `th(?:is|at)`
* 减少回溯, 量词优化, 指数级匹配
* 无法匹配时的情况`/".*"/ -> /"[^"]*"/` 回溯不同点


#### 其他
* 编译缓存
* 加速某些操作 \d+ 通常引擎对常见的类型存在特殊处理方案
* 拆分 有时候分开的比一个大而全的表达式高效, 源于内部优化机制




## 5. 拓展
[构造正则表达式引擎](http://www.cppblog.com/vczh/archive/2008/05/22/50763.html)
[在线测试](http://regex.zjmainstay.cn/)
[正则生成器](http://www.txt2re.com/index.php3)


### 编辑器的技巧

搜索可以使用正则搜索
替换文本时, 前面添加\u\l\U\L可以将捕获的进行大小写转换

```
// eg
'SET_CERTIFICATE' replace '([A-Z]+)_([A-Z])([A-Z]+)'  &  \L$1\U$2\L$3
  => setCertificate
```