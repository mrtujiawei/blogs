# Git 操作 #

## 提升github下载速度 ##

1. 倒入gitee 然后下载  
2. 改镜像 在github.com后面加后缀: github.com.cnpmjs.org

因为经常搞错`git branch` 和 `git checkout`,所以在这里做个记录

## git branch ##

分支的操作,如创建、查看等

- git branch 

	+ 列出本地分支， 当前分支前会有 *
	+ -r 查看远程版本分支列表
	+ -a 查看所有
	+ dev 创建`dev`分支
	+ -d dev 删除`dev`分支
	+ -vv 查看本地分支对应的远程分支
	+ -m old new 重命名

## git checkout ##

操作文件、操作分支

- git checkout 
	
	+ file 放弃单个文件修改
	+ . 放弃当前目录下所有文件修改
	+ dev 切换到`dev`分支
	+ -b dev 切换到`dev`分支，如果不存在则创建

## 删除远程分支 ##

```
git push origin [空格]:[分支名]
```

## 忽略文件 ##

.gitignore

## 合并分支 ##

```
git merge [分支名]
```

## 回退相关 ##

```
git reflog 查看历史提交
git reset --hard HEAD~1 回退到上一个版本
```

## git操作 ##
```bash
// 工作区
git status                         // 查看状态
git add .                          // 将所有修改修改加入暂存区
git commit -m "提交描述"            // 将代码提交到本地仓库
git pull origin <共同开发的远程分支> // 拉取共同开发的远程分支，并合并到本地分支
git push                            // 将本地仓库代码更新到远程仓库

// 恢复修改前
git checkout -- <filename>

// 丢弃保存到暂存区的修改
git reset HEAD <filename>

// 回退一个版本: 修改版本库，修改暂存区，修改工作区
git reset --hard HEAD~1

// 回退到指定版本
git reset --hard commit_id

// 撤销前一次提交
git revert HEAD 

// 撤销前前一次提交
git revert HEAD^

// 撤销指定版本
git revert commit-id

// 删除分支
git branch -d [name_branch]

// 合并分支，去要切换到要合入的分支
git merge [your_branch]

// 分支比较
git diff [branch] [branch]

// 分支重命名
git branch -m [branch] [new_name_branch]

// 暂存未提交的修改
git stash

// 查看stash
git stash list

// 使用暂存的修改，栈顶移除
git stash pop

// 清空
git stash clear

# git 分支命名规范 #

git 分支分为集成分支、功能分支和修复分支，分别命名为 develop、feature 和 hotfix，均为单数。不可使用 features、future、hotfixes、hotfixs 等错误名称。

master（主分支，永远是可用的稳定版本，不能直接在该分支上开发）
develop（开发主分支，所有新功能以这个分支来创建自己的开发分支，该分支只做只合并操作，不能直接在该分支上开发）
feature-xxx（功能开发分支，在develop上创建分支，以自己开发功能模块命名，功能测试正常后合并到develop分支）
feature-xxx-fix(功能bug修复分支，feature分支合并之后发现bug，在develop上创建分支修复，之后合并回develop分支。PS:feature分支在申请合并之后，未合并之前还是可以提交代码的，所以feature在合并之前还可以在原分支上继续修复bug)
hotfix-xxx（紧急bug修改分支，在master分支上创建，修复完成后合并到 master）

注意事项：

一个分支尽量开发一个功能模块，不要多个功能模块在一个分支上开发。
feature 分支在申请合并之前，最好是先 pull 一下 develop 主分支下来，看一下有没有冲突，如果有就先解决冲突后再申请合并。
```