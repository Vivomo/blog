# 在已配置eslint的项目增加precommit做git提交校验的另一种方法

## 以React项目为例

* 第一步, 安装项目相关的eslint和配置lint选项
```text
eslint 相关
npm i eslint eslint-config-react-app eslint-loader eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react -D
```

* 第二步, 安装precommit hook相关包

```text
husky的作用是commit时触发script中的precommit
lint-staged的作用是只检测本次改动的代码
npm i husky lint-staged -D
```

* 第三步, 更新package.json 配置相关项
`package.json` 添加 
```json
{
    "lint-staged": {
        "src/**/*.js": [
          "eslint --fix",
          "git add"
        ]
    },
    "scripts": {
      "precommit": "lint-staged"
    }
}
```
ignore 格式
```json
{
  "lint-staged": {
    "linters": {
      "src/**/*.js": [
        "eslint --fix",
        "git add"
      ]
    },
    "ignore": ["src/components/Editor"]
  }
}
```

