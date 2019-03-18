// 这些规则是关于Node.js 或 在浏览器中使用CommonJS 的：
const nodeCommon = [
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
    }
];

export default nodeCommon;
