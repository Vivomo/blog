* 1. cd .ssh
* 2. git bash
* 3. ssh-keygen -t rsa -C "注释" (更多参数可以google查阅)
* 4. 输入文件名 如react-ex.pub
* 5. 编辑 config文件(没有就新建) 按下面例子格式添加
```text
# 下面的react-ex 是 git 项目名
Host react-ex
HostName github.com
User git
IdentityFile C:\Users\Administrator\.ssh\react-ex
```
* 6. 把新生成的react-ex.pub 文件内容复制, 进入自己的git项目 -> setting -> deploy key -> 新建一个, 复制内容粘贴进去
* 7. 进入自己本地对应的git项目, 打开.git 文件夹找到config 文件编辑, 找到 [remote "origin"] 里面的url那一行. 将冒号前面的域名换成
     第五步里面的Host对应的内容