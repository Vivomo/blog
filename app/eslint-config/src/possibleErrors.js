// 这些规则与JavaScript代码中可能的语法或逻辑错误有关：
const possibleErrors = [
    {
        name: 'for-direction',
        desc: '强制for循环中更新子句的计数器朝着正确的方向移动',
        belong: 'recommended',
        example: `for (var i = 0; i < 10; i--) {}`,
        recommend: 2
    },
    {
        name: 'getter-return',
        desc: '强制 getter 函数中出现 return 语句',
        belong: 'recommended',
        recommend: 2
    },
    {
        name: 'no-async-promise-executor',
        desc: '禁止使用异步函数作为Promise执行程序',
        recommend: 1
    },
    {
        name: 'no-await-in-loop',
        desc: '不允许循环内部使用await',
        recommend: 1
    },
    {
        name: 'no-compare-neg-zero',
        desc: '禁止与-0作比较',
        belong: 'recommended',
        recommend: 2
    },
    {
        name: 'no-cond-assign',
        desc: '在条件表达式中禁止赋值运算符',
        belong: 'recommended',
        recommend: 2
    },
    {
        name: 'no-console',
        desc: '禁止console',
        recommend: 0,
        belong: 'recommended'
    },
    {
        name: 'no-constant-condition',
        desc: '禁止在条件中使用常量表达式',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-control-regex',
        desc: '禁止正则表达式中的控制字符',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-debugger',
        desc: '禁止debugger',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-dupe-args',
        desc: '在函数定义中禁止重复参数',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-dupe-keys',
        desc: '禁止对象文字中的重复键',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-duplicate-case',
        desc: '禁止重复的case',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-empty',
        desc: '禁止空块语句',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-empty-character-class',
        desc: '禁止在正则表达式中使用空字符类',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-ex-assign',
        desc: '禁止在catch子句中重新分配异常',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-extra-boolean-cast',
        desc: '禁止不必要的布尔类型转换',
        recommend: 1,
        belong: 'recommended',
        fixable: true
    },
    {
        name: 'no-extra-parens',
        desc: '不允许不必要的括号',
        recommend: 1,
        fixable: true
    },
    {
        name: 'no-extra-semi',
        desc: '不允许使用不必要的分号',
        recommend: 2,
        belong: 'recommended',
        fixable: true
    },
    {
        name: 'no-func-assign',
        desc: '禁止重新分配函数声明',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-inner-declarations',
        desc: '禁止嵌套块中的变量或函数声明',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-invalid-regexp',
        desc: '禁止在RegExp构造函数中使用无效的正则表达式字符串',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-irregular-whitespace',
        desc: '不允许不规则的空白',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-misleading-character-class',
        desc: '禁止在字符类语法中使用多个代码点生成的字符',
        recommend: 0
    },
    {
        name: 'no-obj-calls',
        desc: '禁止将全局对象属性作为函数调用',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-prototype-builtins',
        desc: '禁止直接在对象上调用一些Object.prototype方法',
        recommend: 0
    },
    {
        name: 'no-regex-spaces',
        desc: '禁止在正则表达式中使用多个空格',
        recommend: 2,
        belong: 'recommended',
        fixable: true
    },
    {
        name: 'no-sparse-arrays',
        desc: '禁止稀疏数组',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-template-curly-in-string',
        desc: '禁止在常规字符串中使用模板文字占位符语法',
        recommend: 0
    },
    {
        name: 'no-unexpected-multiline',
        desc: '不允许混淆多行表达式',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-unreachable',
        desc: '返回，抛出，继续和中断语句后禁止无法访问的代码',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-unsafe-finally',
        desc: '禁止finally语句含return时, try catch块中也有return',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-unsafe-negation',
        desc: '不允许对关系运算符的左操作数取反',
        recommend: 2,
        belong: 'recommended',
        fixable: true
    },
    {
        name: 'require-atomic-updates',
        desc: '禁止因使用await或yield而导致竞争条件的任务',
        recommend: 0
    },
    {
        name: 'use-isnan',
        desc: '在检查NaN时需要调用isNaN()',
        recommend: 1,
        belong: 'recommended'
    },
    {
        name: 'valid-typeof',
        desc: '强制将typeof表达式与有效字符串进行比较',
        recommend: 2,
        belong: 'recommended'
    },
];

export default possibleErrors;
