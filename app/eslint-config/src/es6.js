// ES6
const es6 = [
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
    }
];

export default es6;
