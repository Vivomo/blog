// Stylistic Issues
// 这些规则是关于风格指南的，而且是非常主观的
const stylistcIssues = [

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

export default stylistcIssues;
