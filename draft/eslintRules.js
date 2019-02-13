const rules = [
    // 这些规则与JavaScript代码中可能的语法或逻辑错误有关：
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
    // 这些规则涉及更好的做事方式，以帮助您避免问题：
    {
        name: 'accessor-pairs',
        desc: '在对象中强制执行getter和setter对',
        recommend: 0
    },
    {
        name: 'array-callback-return',
        desc: '在数组方法的回调中强制执行return语句',
        recommend: 0
    },
    {
        name: 'block-scoped-var',
        desc: '强制在其定义的范围内使用变量',
        recommend: 2
    },
    {
        name: 'class-methods-use-this',
        desc: '强制类方法必须含this(如果没有,此方法应该为静态方法)',
        recommend: 1
    },
    {
        //如果您无法确定代码的适当复杂性限制，则最好禁用此规则。
        name: 'complexity',
        desc: '限制执行程序中允许的最大圈复杂度',
        recommend: 0
    },
    {
        name: 'consistent-return',
        desc: '要求return的值要么不指定, 要么同一类型',
        recommend: 2
    },
    {
        name: 'curly',
        desc: '为所有控制语句强制执行一致的大括号样式',
        recommend: 2,
        fixable: true
    },
    {
        name: 'default-case',
        desc: 'switch语句需要包含default case',
        recommend: 2
    },
    {
        name: 'dot-location',
        desc: '点运算符换行位置',
        recommend: 0,
        fixable: true
    },
    {
        name: 'dot-notation',
        desc: '点运算替代不必要的key(a["b"] => a.b)',
        recommend: 2,
        fixable: true
    },
    {
        name: 'eqeqeq',
        desc: '=== 和 !==  替代 == 和 !=',
        recommend: 2,
        fixable: true
    },
    {
        name: 'guard-for-in',
        desc: 'for key in需要包含 if hasOwnProperty判断',
        recommend: 2
    },
    {
        name: 'max-classes-per-file',
        desc: '每个文件强制执行最大数量的类',
        recommend: 2,
        value: ['error', 1]
    },
    {
        name: 'no-alert',
        desc: '禁止使用alert，confirm和prompt',
        recommend: 2
    },
    {
        name: 'no-caller',
        desc: '不允许使用arguments.caller或arguments.callee',
        recommend: 2
    },
    {
        name: 'no-case-declarations',
        desc: 'case中不允许使用变量声明(可以用花括号控制作用域 case: { let a = 1})',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-div-regex',
        desc: '在正则表达式的开头明确禁止除法运算符',
        recommend: 0
    },
    {
        name: 'no-else-return',
        desc: '禁止else中的return(如果if中含return, else里面的return显得不必要了)',
        recommend: 1,
        fixable: true
    },
    {
        name: 'no-empty-function',
        desc: '不允许空方法',
        recommend: 0
    },
    {
        name: 'no-empty-pattern',
        desc: '不允许空的解构模式',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-eq-null',
        desc: '禁止在没有类型检查运算符的情况下进行空比较',
        recommend: 0
    },
    {
        name: 'no-eval',
        desc: '不允许使用eval',
        recommend: 2
    },
    {
        name: 'no-extend-native',
        desc: '禁止拓展原生对象',
        recommend: 2
    },
    {
        name: 'no-extra-bind',
        desc: '禁止不必要的.bind()',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-extra-label',
        desc: '禁止不必要的标签',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-fallthrough',
        desc: '禁止case语句落空',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-floating-decimal',
        desc: '禁止数字文字中的前导或尾随小数点(可读性差)',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-global-assign',
        desc: '禁止给原生对象或只读全局变量赋值',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-implicit-coercion',
        desc: '禁止使用短符号进行类型转换',
        recommend: 2,
        fixable: true,
        value: [2, {'allow': ['!!', '~']}]
    },
    {
        name: 'no-implicit-globals',
        desc: '禁止全局范围内的变量和函数声明',
        recommend: 2
    },
    {
        name: 'no-implied-eval',
        desc: '不允许使用类似eval（）的方法',
        recommend: 0
    },
    {
        name: 'no-invalid-this',
        desc: '禁止 this 关键字出现在类和类对象之外',
        recommend: 2
    },
    {
        name: 'no-iterator',
        desc: '禁用 __iterator__ 属性',
        recommend: 2
    },
    {
        name: 'no-labels',
        desc: '禁用标签语句',
        recommend: 0
    },
    {
        name: 'no-lone-blocks',
        desc: '禁用不必要的嵌套块',
        recommend: 2
    },
    {
        name: 'no-loop-func',
        desc: '禁止在循环中出现 function 声明和表达式',
        recommend: 2
    },
    {
        name: 'no-magic-numbers',
        desc: '禁用魔术数字',
        recommend: 2,
        value: ["error", { "ignore": [1, 2] }]
    },
    {
        name: 'no-multi-spaces',
        desc: '禁止多个空格',
        recommend: 2,
        fixable: true,
        value: ["error", { "ignoreEOLComments": true }]
    },
    {
        name: 'no-multi-str',
        desc: '禁止多行字符串',
        recommend: 2
    },
    {
        name: 'no-new',
        desc: '禁止使用 new 以避免产生副作用',
        recommend: 0
    },
    {
        name: 'no-new-func',
        desc: '禁止对 Function 对象使用 new 操作符',
        recommend: 0
    },
    {
        name: 'no-new-wrappers',
        desc: '禁止对 String，Number 和 Boolean 使用 new 操作符',
        recommend: 2
    },
    {
        name: 'no-octal',
        desc: '禁用八进制字面量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-octal-escape',
        desc: '禁止在字符串中使用八进制转义序列',
        recommend: 2
    },
    {
        name: 'no-param-reassign',
        desc: '禁止对 function 的参数进行重新赋值', recommend: 1
    },
    {
        name: 'no-proto',
        desc: '禁用 __proto__ 属性',
        recommend: 2
    },
    {
        name: 'no-redeclare',
        desc: '禁止多次声明同一变量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-restricted-properties',
        desc: '禁止使用对象的某些属性',
        recommend: 0
    },
    {
        name: 'no-return-assign',
        desc: '禁止在 return 语句中使用赋值语句',
        recommend: 2
    },
    {
        name: 'no-return-await',
        desc: '禁用不必要的 return await',
        recommend: 2
    },
    {
        name: 'no-script-url',
        desc: '禁止使用 javascript: url',
        recommend: 0
    },
    {
        name: 'no-self-assign',
        desc: '禁止自我赋值',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-self-compare',
        desc: '禁止自身比较',
        recommend: 2
    },
    {
        name: 'no-sequences',
        desc: '禁用逗号操作符',
        recommend: 2
    },
    {
        name: 'no-throw-literal',
        desc: '禁止抛出异常字面量',
        recommend: 0
    },
    {
        name: 'no-unmodified-loop-condition',
        desc: '禁用一成不变的循环条件',
        recommend: 0
    },
    {
        name: 'no-unused-expressions',
        desc: '禁止出现未使用过的表达式',
        recommend: 1
    },
    {
        name: 'no-unused-labels',
        desc: '禁用出现未使用过的标签',
        recommend: 2,
        belong: 'recommended',
        fixable: true
    },
    {
        name: 'no-useless-call',
        desc: '禁止不必要的 .call() 和 .apply()',
        recommend: 0
    },
    {
        name: 'no-useless-catch',
        desc: '禁止不必要的catch',
        recommend: 2
    },
    {
        name: 'no-useless-concat',
        desc: '禁止不必要的字符串字面量或模板字面量的连接',
        recommend: 2
    },
    {
        name: 'no-useless-escape',
        desc: '禁用不必要的转义字符',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-useless-return',
        desc: '禁止多余的 return 语句',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-void',
        desc: '禁用 void 操作符',
        recommend: 0
    },
    {
        name: 'no-warning-comments',
        desc: '禁止在注释中使用特定的警告术语',
        recommend: 0
    },
    {
        name: 'no-with',
        desc: '禁用 with 语句',
        recommend: 0
    },
    {
        name: 'prefer-promise-reject-errors',
        desc: '要求使用 Error 对象作为 Promise 拒绝的原因',
        recommend: 0
    },
    {
        name: 'radix',
        desc: '强制在parseInt()使用基数参数',
        recommend: 0
    },
    {
        name: 'require-await',
        desc: '禁止使用不带 await 表达式的 async 函数',
        recommend: 2
    },
    {
        name: 'require-unicode-regexp',
        desc: '在RegExp上强制使用u标志',
        recommend: 0
    },
    {
        name: 'vars-on-top',
        desc: '要求所有的 var 声明出现在它们所在的作用域顶部',
        recommend: 0
    },
    {
        name: 'wrap-iife',
        desc: '要求 IIFE 使用括号括起来',
        recommend: 0,
        fixable: true
    },
    {
        name: 'yoda',
        desc: '要求或禁止 “Yoda” 条件',
        recommend: 0,
        fixable: true
    }
];

//
// Array.from(trs).map(({children}) => {
//     let obj = {
//         name: children[2].innerText,
//         desc: '',
//         recommend: 0
//     };
//     if (children[0].innerHTML.trim()) {
//         obj.belong = 'recommended'
//     }
//     if (children[1].innerHTML.trim()) {
//         obj.fixable = true
//     }
//     return obj;
// })
