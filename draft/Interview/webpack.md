### webpack 工作流程

1. 初始化参数：从配置文件和Shell语句中读取和合并参数，得出最终的参数。
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译。
3. 确定入口：从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去。
4. 编译模块：递归中根据文件类型和loader配置，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译并输出：在经过第4步使用Loader处理后，得到每个模块被处理后的最终内容以及它们之间的依赖关系，根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。
6. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

### Webpack 插件机制
webpack的插件机制是基于Tapable库实现的一种事件流机制，它可以让我们在webpack的构建过程中的不同阶段插入自定义的逻辑，
扩展webpack的功能。一个webpack插件是一个具有apply方法的对象，它可以通过compiler对象访问webpack的API，
并监听webpack广播出来的事件。webpack插件可以通过在配置文件中的plugins数组中添加实例来安装。
webpack提供了很多内置的插件，也有很多第三方的插件，可以满足不同的需求。

[揭秘webpack插件工作流程和原理](https://zhuanlan.zhihu.com/p/141447713)
### Webpack Loader
webpack loader是一种对模块源代码进行转换的工具，它可以让你在导入或“加载”模块时对文件进行预处理。
因此，loader有点像其他构建工具中的“任务”，并提供了一种强大的方式来处理前端构建步骤。
webpack loader可以通过在配置文件中的module.rules数组中指定不同的规则来使用。webpack提供了很多内置的loader，
也有很多第三方的loader，可以处理不同类型的文件，如CSS、LESS、SASS、TypeScript、Babel等。

### Webpack 中的 Dependency Graph 的原理及实现
webpack中的dependency graph是一种表示模块之间依赖关系的数据结构，它可以让webpack知道哪些模块和文件被应用程序所需要，
然后将它们打包成一个或多个bundle。webpack的dependency graph的原理和实现是基于以下几个步骤：

1. 从配置文件或命令行参数中获取入口点(entry points)列表，这些入口点是应用程序的起始模块。
2. 对每个入口点，使用loader对其源代码进行转换，并使用acorn库解析成AST(抽象语法树)。
3. 遍历AST，找出所有的依赖项，即require()或import()语句引用的模块。
4. 对每个依赖项，重复步骤2和3，直到找出所有的模块和文件。
5. 根据入口点和依赖关系，将模块分组成一个或多个chunk(代码块)，并为每个chunk分配一个唯一的ID。
6. 对每个chunk，使用模板(template)生成输出文件，并添加必要的运行时代码，如__webpack_require__函数。
7. 将输出文件写入到指定的输出路径(output path)。

(1) Dependency Graph | webpack. https://webpack.js.org/concepts/dependency-graph/ 
(2) Stats Data | webpack. https://webpack.js.org/api/stats/ 
(3) 依赖图(dependency graph) | webpack 中文文档. https://webpack.docschina.org/concepts/dependency-graph/ 
(4) Dependency Graph | 웹팩. https://webpack.kr/concepts/dependency-graph/ 
(5) Webpack Dependency Graph深度解析 | kyleezhang`s Blog. https://kyleezhang.github.io/2021/08/12/webpack-dependency/ 
### rollup 与 webpack 有什么相同点和区别
rollup和webpack都是JavaScript模块打包器，它们的相同点有以下几个：

- 都支持ES6模块、CommonJS模块和AMD模块
- 都支持loader和plugin机制，可以处理不同类型的文件和扩展功能
- 都支持tree-shaking，可以去除未使用的代码
- 都支持code-splitting，可以将代码分割成多个chunk

它们的区别有以下几个：

- rollup更轻量，输出的代码更精简，没有webpack内部的结构和运行时代码
- rollup更适合打包library，可以输出多种格式的模块，如ESM、UMD、IIFE等；webpack更适合打包应用程序，可以处理复杂的依赖关系和动态导入
- rollup没有官方的devServer工具，需要借助其他工具或插件来实现开发服务器；webpack有自带的webpack-dev-server工具，可以提供热更新和代理等功能
- rollup没有官方的HMR(热模块替换)功能，需要借助其他工具或插件来实现；webpack有自带的HMR功能，可以在不刷新页面的情况下更新模块
- rollup有很多社区插件，但是维护程度不一；webpack有很多官方插件，选择起来更方便

### Webpack HMR 原理

- 使用webpack-dev-server(后面简称WDS)托管静态资源，同时以Runtime方式注入HMR客户端代码
- 浏览器加载页面后，与WDS建立WebSocket连接
- webpack监听到文件变化后，增量构建发生变更的模块，并通过WebSocket发送hash事件和ok事件
- 浏览器收到hash事件后，保存最新的hash值；收到ok事件后，调用HMR客户端代码的check方法
- check方法向WDS发送ajax请求，获取发生变更的模块列表
- 根据模块列表，再次向WDS发送jsonp请求，获取模块的更新代码
- 用更新代码中的新模块替换掉旧模块，并执行模块的accept回调函数


