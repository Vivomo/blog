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
        value: [2, {allow: ['!!', '~']}]
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
        value: ['error', {ignore: [1, 2]}]
    },
    {
        name: 'no-multi-spaces',
        desc: '禁止多个空格',
        recommend: 2,
        fixable: true,
        value: ['error', {ignoreEOLComments: true}]
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
    },
    // 该规则与使用严格模式和严格模式指令有关
    {
        name: 'strict',
        desc: '要求或禁止使用严格模式指令',
        recommend: 0,
        fixable: true
    },
    // 这些规则与变量声明有关 Variables
    {
        name: 'init-declarations',
        desc: '要求或禁止 var 声明中的初始化',
        recommend: 0
    },
    {
        name: 'no-delete-var',
        desc: '禁止删除变量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-label-var',
        desc: '不允许标签与变量同名',
        recommend: 2
    },
    {
        name: 'no-restricted-globals',
        desc: '禁用特定的全局变量',
        recommend: 0
    },
    {
        name: 'no-shadow',
        desc: '禁止变量声明与外层作用域的变量同名',
        recommend: 2
    },
    {
        name: 'no-shadow-restricted-names',
        desc: '禁止将标识符定义为受限的名字',
        recommend: 2
    },
    {
        name: 'no-undef',
        desc: '禁用未声明的变量，除非它们在 /*global */ 注释中被提到',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-undef-init',
        desc: '禁止将变量初始化为 undefined',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-undefined',
        desc: '禁止将 undefined 作为标识符',
        recommend: 2
    },
    {
        name: 'no-unused-vars',
        desc: '禁止出现未使用过的变量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-use-before-define',
        desc: '禁止在变量定义之前使用它们',
        recommend: 2
    },
    // 这些规则是关于Node.js 或 在浏览器中使用CommonJS 的：
    {
        name: 'callback-return',
        desc: '强制数组方法的回调函数中有 return 语句',
        recommend: 0
    },
    {
        name: 'global-require',
        desc: '要求 require() 出现在顶层模块作用域中',
        recommend: 0
    },
    {
        name: 'handle-callback-err',
        desc: '要求回调函数中有容错处理',
        recommend: 0
    },
    {
        name: 'no-buffer-constructor',
        desc: '禁用 Buffer() 构造函数',
        recommend: 0
    },
    {
        name: 'no-mixed-requires',
        desc: '禁止混合常规变量声明和 require 调用',
        recommend: 0
    },
    {
        name: 'no-new-require',
        desc: '禁止调用 require 时使用 new 操作符',
        recommend: 0
    },
    {
        name: 'no-path-concat',
        desc: '禁止对 __dirname 和 __filename 进行字符串连接',
        recommend: 0
    },
    {
        name: 'no-process-env',
        desc: '禁用 process.env',
        recommend: 0
    },
    {
        name: 'no-process-exit',
        desc: '禁用 process.exit()',
        recommend: 0
    },
    {
        name: 'no-restricted-modules',
        desc: '禁用通过 require 加载的指定模块',
        recommend: 0
    },
    {
        name: 'no-sync',
        desc: '禁用同步方法',
        recommend: 0
    },
    // ES6
    {
        name: 'arrow-body-style',
        desc: '要求箭头函数体使用大括号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'arrow-parens',
        desc: '要求箭头函数的参数使用圆括号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'arrow-spacing',
        desc: '强制箭头函数的箭头前后使用一致的空格',
        recommend: 1,
        fixable: true,
        value: [1, {before: false, after: false}]
    },
    {
        name: 'constructor-super',
        desc: '要求在构造函数中有 super() 的调用',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'generator-star-spacing',
        desc: '强制 generator 函数中 * 号周围使用一致的空格',
        recommend: 1,
        fixable: true,
        value: [1, {before: true, after: false}]
    },
    {
        name: 'no-class-assign',
        desc: '禁止修改类声明的变量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-confusing-arrow',
        desc: '禁止在可能与比较操作符相混淆的地方使用箭头函数',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-const-assign',
        desc: '禁止修改 const 声明的变量',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-dupe-class-members',
        desc: '禁止类成员中出现重复的名称',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-duplicate-imports',
        desc: '禁止重复模块导入',
        recommend: 2
    },
    {
        name: 'no-new-symbol',
        desc: '禁止 Symbolnew 操作符和 new 一起使用',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-restricted-imports',
        desc: '禁止使用指定的 import 加载的模块',
        recommend: 0
    },
    {
        name: 'no-this-before-super',
        desc: '禁止在构造函数中，在调用 super() 之前使用 this 或 super',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-useless-computed-key',
        desc: '禁止在对象中使用不必要的计算属性',
        recommend: 1,
        fixable: true
    },
    {
        name: 'no-useless-constructor',
        desc: '禁用不必要的构造函数',
        recommend: 1
    },
    {
        name: 'no-useless-rename',
        desc: '禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-var',
        desc: '要求使用 let 或 const 而不是 var',
        recommend: 1,
        fixable: true
    },
    {
        name: 'object-shorthand',
        desc: '要求或禁止对象字面量中方法和属性使用简写语法',
        recommend: 0,
        fixable: true
    },
    {
        name: 'prefer-arrow-callback',
        desc: '要求回调函数使用箭头函数',
        recommend: 0,
        fixable: true
    },
    {
        name: 'prefer-const',
        desc: '要求使用 const 声明那些声明后不再被修改的变量',
        recommend: 0,
        fixable: true
    },
    {
        name: 'prefer-destructuring',
        desc: '优先使用数组和对象解构',
        recommend: 0
    },
    {
        name: 'prefer-numeric-literals',
        desc: '禁用 parseInt() 和 Number.parseInt()，使用二进制，八进制和十六进制字面量',
        recommend: 0,
        fixable: true
    },
    {
        name: 'prefer-rest-params',
        desc: '要求使用剩余参数而不是 arguments',
        recommend: 0
    },
    {
        name: 'prefer-spread',
        desc: '要求使用扩展运算符而非 .apply()',
        recommend: 0,
        fixable: true
    },
    {
        name: 'prefer-template',
        desc: '要求使用模板字面量而非字符串连接',
        recommend: 0,
        fixable: true
    },
    {
        name: 'require-yield',
        desc: '要求 generator 函数内有 yield',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'rest-spread-spacing',
        desc: '强制剩余和扩展运算符及其表达式之间有空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'sort-imports',
        desc: '强制模块内的 import 排序',
        recommend: 0,
        fixable: true
    },
    {
        name: 'symbol-description',
        desc: '要求 symbol 描述',
        recommend: 1
    },
    {
        name: 'template-curly-spacing',
        desc: '要求或禁止模板字符串中的嵌入表达式周围空格的使用',
        recommend: 0,
        fixable: true
    },
    {
        name: 'yield-star-spacing',
        desc: '强制在 yield* 表达式中 * 周围使用空格',
        recommend: 0,
        fixable: true
    },
    // Stylistic Issues
    // 这些规则是关于风格指南的，而且是非常主观的
    {
        name: 'array-bracket-newline',
        desc: '在数组开括号后和闭括号前强制换行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'array-bracket-spacing',
        desc: '强制数组方括号中使用一致的空格',
        recommend: 1,
        fixable: true
    },
    {
        name: 'array-element-newline',
        desc: '强制数组元素间出现换行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'block-spacing',
        desc: '禁止或强制在代码块中开括号前和闭括号后有空格',
        recommend: 0,
        fixable: true,
        value: [2, 'always']
    },
    {
        name: 'brace-style',
        desc: '强制在代码块中使用一致的大括号风格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'camelcase',
        desc: '强制使用骆驼拼写法命名约定',
        recommend: 2
    },
    {
        name: 'capitalized-comments',
        desc: '强制或禁止对注释的第一个字母大写',
        recommend: 0,
        fixable: true
    },
    {
        name: 'comma-dangle',
        desc: '要求或禁止末尾逗号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'comma-spacing',
        desc: '强制在逗号前后使用一致的空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'comma-style',
        desc: '强制使用一致的逗号风格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'computed-property-spacing',
        desc: '强制在计算的属性的方括号中使用一致的空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'consistent-this',
        desc: '当获取当前执行环境的上下文时，强制使用一致的命名',
        recommend: 0
    },
    {
        name: 'eol-last',
        desc: '要求或禁止文件末尾存在空行',
        recommend: 1,
        fixable: true
    },
    {
        name: 'func-call-spacing',
        desc: '要求或禁止在函数标识符和其调用之间有空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'func-name-matching',
        desc: '要求函数名与赋值给它们的变量名或属性名相匹配',
        recommend: 0
    },
    {
        name: 'func-names',
        desc: '要求或禁止使用命名的 function 表达式',
        recommend: 0
    },
    {
        name: 'func-style',
        desc: '强制一致地使用 function 声明或表达式',
        recommend: 0
    },
    {
        name: 'function-paren-newline',
        desc: '强制在函数括号内使用一致的换行',
        recommend: 2,
        fixable: true
    },
    {
        name: 'id-blacklist',
        desc: '禁用指定的标识符',
        recommend: 0
    },
    {
        name: 'id-length',
        desc: '强制标识符的最小和最大长度',
        recommend: 0
    },
    {
        name: 'id-match',
        desc: '要求标识符匹配一个指定的正则表达式',
        recommend: 0
    },
    {
        name: 'implicit-arrow-linebreak',
        desc: '强制隐式返回的箭头函数体的位置',
        recommend: 2,
        fixable: true
    },
    {
        name: 'indent',
        desc: '强制使用一致的缩进',
        recommend: 2,
        fixable: true
    },
    {
        name: 'jsx-quotes',
        desc: '强制在 JSX 属性中一致地使用双引号或单引号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'key-spacing',
        desc: '强制在对象字面量的属性中键和值之间使用一致的间距',
        recommend: 2,
        fixable: true
    },
    {
        name: 'keyword-spacing',
        desc: '强制在关键字前后使用一致的空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'line-comment-position',
        desc: '强制行注释的位置',
        recommend: 0
    },
    {
        name: 'linebreak-style',
        desc: '强制使用一致的换行风格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'lines-around-comment',
        desc: '要求在注释周围有空行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'lines-between-class-members',
        desc: '要求或禁止类成员之间出现空行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'max-depth',
        desc: '强制可嵌套的块的最大深度',
        recommend: 0
    },
    {
        name: 'max-len',
        desc: '强制一行的最大长度',
        recommend: 0,
        value: ['error', {code: 150}]
    },
    {
        name: 'max-lines',
        desc: '强制最大行数',
        recommend: 0
    },
    {
        name: 'max-nested-callbacks',
        desc: '强制回调函数最大嵌套深度',
        recommend: 0
    },
    {
        name: 'max-params',
        desc: '强制函数定义中最多允许的参数数量',
        recommend: 0
    },
    {
        name: 'max-statements',
        desc: '强制函数块最多允许的的语句数量',
        recommend: 0
    },
    {
        name: 'max-statements-per-line',
        desc: '强制每一行中所允许的最大语句数量',
        recommend: 0
    },
    {
        name: 'multiline-comment-style',
        desc: '强制对多行注释使用特定风格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'multiline-ternary',
        desc: '要求或禁止在三元操作数中间换行',
        recommend: 0
    },
    {
        name: 'new-cap',
        desc: '要求构造函数首字母大写',
        recommend: 2
    },
    {
        name: 'new-parens',
        desc: '要求调用无参构造函数时有圆括号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'newline-per-chained-call',
        desc: '要求方法链中每个调用都有一个换行符',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-array-constructor',
        desc: '禁用 Array 构造函数',
        recommend: 1
    },
    {
        name: 'no-bitwise',
        desc: '禁用按位运算符',
        recommend: 0
    },
    {
        name: 'no-continue',
        desc: '禁用 continue 语句',
        recommend: 0
    },
    {
        name: 'no-inline-comments',
        desc: '禁止在代码后使用内联注释',
        recommend: 0
    },
    {
        name: 'no-lonely-if',
        desc: '禁止 if 作为唯一的语句出现在 else 语句中',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-mixed-operators',
        desc: '禁止混合使用不同的操作符',
        recommend: 0
    },
    {
        name: 'no-mixed-spaces-and-tabs',
        desc: '禁止空格和 tab 的混合缩进',
        recommend: 2,
        belong: 'recommended'
    },
    {
        name: 'no-multi-assign',
        desc: '禁止连续赋值',
        recommend: 0
    },
    {
        name: 'no-multiple-empty-lines',
        desc: '禁止出现多行空行',
        recommend: 2,
        fixable: true
    },
    {
        name: 'no-negated-condition',
        desc: '禁用否定的表达式',
        recommend: 1
    },
    {
        name: 'no-nested-ternary',
        desc: '禁用嵌套的三元表达式',
        recommend: 0
    },
    {
        name: 'no-new-object',
        desc: '禁用 Object 的构造函数',
        recommend: 0
    },
    {
        name: 'no-plusplus',
        desc: '禁用一元操作符 ++ 和 --',
        recommend: 0
    },
    {
        name: 'no-restricted-syntax',
        desc: '禁用特定的语法',
        recommend: 0
    },
    {
        name: 'no-tabs',
        desc: '禁用 tab',
        recommend: 0
    },
    {
        name: 'no-ternary',
        desc: '禁用三元操作符',
        recommend: 0
    },
    {
        name: 'no-trailing-spaces',
        desc: '禁用行尾空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-underscore-dangle',
        desc: '禁止标识符中有悬空下划线',
        recommend: 0
    },
    {
        name: 'no-unneeded-ternary',
        desc: '禁止可以在有更简单的可替代的表达式时使用三元操作符',
        recommend: 0,
        fixable: true
    },
    {
        name: 'no-whitespace-before-property',
        desc: '禁止属性前有空白',
        recommend: 2,
        fixable: true
    },
    {
        name: 'nonblock-statement-body-position',
        desc: '强制单个语句的位置',
        recommend: 2,
        fixable: true
    },
    {
        name: 'object-curly-newline',
        desc: '强制大括号内换行符的一致性',
        recommend: 2,
        fixable: true
    },
    {
        name: 'object-curly-spacing',
        desc: '强制在大括号中使用一致的空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'object-property-newline',
        desc: '强制将对象的属性放在不同的行上',
        recommend: 0,
        fixable: true
    },
    {
        name: 'one-var',
        desc: '强制函数中的变量要么一起声明要么分开声明',
        recommend: 0
    },
    {
        name: 'one-var-declaration-per-line',
        desc: '要求或禁止在变量声明周围换行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'operator-assignment',
        desc: '要求或禁止在可能的情况下使用简化的赋值操作符',
        recommend: 0,
        fixable: true
    },
    {
        name: 'operator-linebreak',
        desc: '强制操作符使用一致的换行符',
        recommend: 0,
        fixable: true
    },
    {
        name: 'padded-blocks',
        desc: '要求或禁止块内填充',
        recommend: 0,
        fixable: true
    },
    {
        name: 'padding-line-between-statements',
        desc: '要求或禁止在语句间填充空行',
        recommend: 0,
        fixable: true
    },
    {
        name: 'quote-props',
        desc: '要求对象字面量属性名称用引号括起来',
        recommend: 0,
        fixable: true
    },
    {
        name: 'quotes',
        desc: '强制使用一致的反勾号、双引号或单引号',
        recommend: 0,
        fixable: true
    },
    {
        name: 'require-jsdoc',
        desc: '要求使用 JSDoc 注释',
        recommend: 0
    },
    {
        name: 'semi',
        desc: '要求或禁止使用分号代替 ASI',
        recommend: 2,
        fixable: true
    },
    {
        name: 'semi-spacing',
        desc: '强制分号之前和之后使用一致的空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'semi-style',
        desc: '强制分号的位置',
        recommend: 2,
        fixable: true
    },
    {
        name: 'sort-keys',
        desc: '要求对象属性按序排列',
        recommend: 0
    },
    {
        name: 'sort-vars',
        desc: '要求同一个声明块中的变量按顺序排列',
        recommend: 0,
        fixable: true
    },
    {
        name: 'space-before-blocks',
        desc: '强制在块之前使用一致的空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'space-before-function-paren',
        desc: '强制在 function的左括号之前使用一致的空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'space-in-parens',
        desc: '强制在圆括号内使用一致的空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'space-infix-ops',
        desc: '要求操作符周围有空格',
        recommend: 2,
        fixable: true
    },
    {
        name: 'space-unary-ops',
        desc: '强制在一元操作符前后使用一致的空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'spaced-comment',
        desc: '强制在注释中 // 或 /* 使用一致的空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'switch-colon-spacing',
        desc: '强制在 switch 的冒号左右有空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'template-tag-spacing',
        desc: '要求或禁止在模板标记和它们的字面量之间有空格',
        recommend: 0,
        fixable: true
    },
    {
        name: 'unicode-bom',
        desc: '要求或禁止 Unicode 字节顺序标记 (BOM)',
        recommend: 0,
        fixable: true
    },
    {
        name: 'wrap-regex',
        desc: '要求正则表达式被括号括起来',
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
