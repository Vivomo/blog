// 这些规则与变量声明有关
const variables = [
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
];

export default variables;
