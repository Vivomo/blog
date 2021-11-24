# 基础

## 获取 Git 仓库
* 将尚未进行版本控制的本地目录转换为 Git 仓库；
* 从其它服务器 克隆 一个已存在的 Git 仓库。

### 在已存在目录中初始化仓库
在该目录下 执行 `git init`， 该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。
可以通过 `git add` 命令来指定所需的文件来进行追踪，然后执行 `git commit`

### 克隆现有的仓库
克隆仓库的命令是 `git clone <url>`

如果你想在克隆远程仓库的时候，自定义本地仓库的名字，你可以通过额外的参数指定新的目录名：
``` 
git clone https://github.com/libgit2/libgit2 mylibgit
```

## 记录每次更新到仓库
工作目录下的每一个文件都不外乎这两种状态：已跟踪 或 未跟踪

### 检查当前文件状态
`git status` 命令查看哪些文件处于什么状态, 未跟踪的文件 会显示在 Untracked files下面， 可以使用 `git add <filename>` 进行追踪

只要在 `Changes to be committed` 这行下面的，就说明是已暂存状态。 git add 命令使用文件或目录的路径作为参数；如果参数是目录的路径，该命令将递归地跟踪该目录下的所有文件。
`git add .` 会将所有可被跟踪的文件加入到跟踪和暂存状态

### 状态简览
使用 `git status -s` 命令或 `git status --short` 命令，你将得到一种格式更为紧凑的输出。
``` 
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```
新添加的未跟踪文件前面有 ?? 标记，新添加到暂存区中的文件前面有 A 标记，修改过的文件前面有 M 标记。 输出中有两栏，左栏指明了暂存区的状态，右栏指明了工作区的状态。

### 忽略文件
文件 .gitignore 的格式规范如下：

* 所有空行或者以 # 开头的行都会被 Git 忽略。
* 可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。
* 匹配模式可以以（/）开头防止递归。
* 匹配模式可以以（/）结尾指定目录。
* 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（!）取反。

### 查看已暂存和未暂存的修改
`git diff` 命令比较的是工作目录中当前文件和暂存区域快照之间的差异。 也就是修改之后还没有暂存起来的变化内容
`git diff --staged`  这条命令将比对已暂存文件与最后一次提交的文件差异
`git diff --cached` 同上（ --staged 和 --cached 是同义词）

### 提交更新
`git commit -m "some msg"`

### 跳过使用暂存区域
`git commit` 加上 -a 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤
``` 
git commit -a -m 'some msg'
```

### 删除文件
`git rm` 连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了
`git rm --cached <filename>` git 中移除，本地文件依然保留

### 移动文件
`git mv file_from file_to` 文件改名, `git mv` 就相当于运行了下面三条命令
``` 
$ mv README.md README
$ git rm README.md
$ git add README
```

## 查看提交历史
`git log` 会按时间先后顺序列出所有的提交，-p 或 --patch ，它会显示每次提交所引入的差异（按 补丁 的格式输出）
使用 -2 选项来只显示最近的两次提交， 如果看到每次提交的简略统计信息，可以使用 --stat，
--pretty。 这个选项可以使用不同于默认格式的方式展示提交历史。 这个选项有一些内建的子选项供你使用。 比如 oneline 会将每个提交放在一行显示，在浏览大量的提交时非常有用。 另外还有 short，full 和 fuller 选项，它们展示信息的格式基本一致，但是详尽程度不一。
一些其他限制 如 限制时间 内的提交参照官网文档

## 撤消操作
`git commit --amend`
``` 
$ git commit -m 'initial commit'
$ git add forgotten_file
$ git commit --amend
```
最终你只会有一个提交——第二次提交将代替第一次提交的结果

### 取消暂存的文件
`git reset HEAD <file>`

## 远程仓库的使用 略

## 打标签
### 列出标签
``` 
$ git tag
v1.0
v2.0
$ git tag -l "v1.8.5*"
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5-rc2
```

Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。

轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。

### 创建标签
轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。

而附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间， 此外还有一个标签信息，
并且可以使用 GNU Privacy Guard （GPG）签名并验证。 通常会建议创建附注标签，这样你可以拥有以上所有信息。但是如果你只是想用一个临时的标签，
或者因为某些原因不想要保存这些信息，那么也可以用轻量标签。

#### 附注标签
创建附注标签 `git tag -a v1.4 -m "my version 1.4"`
查看标签信息和与之对应的提交信息 `git show`

#### 轻量标签
另一种给提交打标签的方式是使用轻量标签。 轻量标签本质上是将提交校验和存储到一个文件中——没有保存任何其他信息。 创建轻量标签，
不需要使用 -a、-s 或 -m 选项，只需要提供标签名字
``` 
$ git tag v1.4-lw
$ git tag
v0.1
v1.3
v1.4
v1.4-lw
```
这时，如果在标签上运行 `git show`，你不会看到额外的标签信息。 命令只会显示出提交信息

### 后期打标签
你也可以对过去的提交打标签。 假设提交历史是这样的：
```
$ git log --pretty=oneline
15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
```
现在，假设在 v1.2 时你忘记给项目打标签，也就是在 “updated rakefile” 提交。 你可以在之后补上标签。 要在那个提交上打标签，
你需要在命令的末尾指定提交的校验和（或部分校验和）：
``` 
$ git tag -a v1.2 9fceb02
```

### 共享标签
默认情况下，git push 命令并不会传送标签到远程仓库服务器上。 在创建完标签后你必须显式地推送标签到共享服务器上。
这个过程就像共享远程分支一样——你可以运行 `git push origin <tagname>`。

### 删除标签
要删除掉你本地仓库上的标签，可以使用命令 git tag -d <tagname>。 例如，可以使用以下命令删除一个轻量标签
``` 
$ git tag -d v1.4-lw
Deleted tag 'v1.4-lw' (was e7d5add)
```
注意上述命令并不会从任何远程仓库中移除这个标签，你必须用 git push <remote> :refs/tags/<tagname> 来更新你的远程仓库：

第一种变体是 git push <remote> :refs/tags/<tagname>
第二种更直观的删除远程标签的方式是：
``` 
$ git push origin --delete <tagname>
```
### 检出标签 略

## Git别名
果不想每次都输入完整的 Git 命令，可以通过 git config 文件来轻松地为每一个命令设置一个别名。
``` 
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status
```

``` 
$ git config --global alias.unstage 'reset HEAD --'
```
这会使下面的两个命令等价：
``` 
$ git unstage fileA
$ git reset HEAD -- fileA
```