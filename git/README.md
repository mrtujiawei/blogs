# Git 操作 #

## 提升github下载速度 ##

1. 倒入gitee 然后下载  
2. 改镜像 在github.com后面加后缀: github.com.cnpmjs.org

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

## 删除远程分支 ##

```
git push origin [空格]:[分支名]
```

## 回退相关 ##

```
git reflog 查看历史提交
git reset --hard HEAD~1 回退到上一个版本
```

## git操作 ##
```bash
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

// 分支比较
git diff [branch] [branch]

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
```

```
git bisect 查找错误出现的版本
git bisect [bad|good]

git blame 查看代码责任人

git grep 查找指定的代码
git log -SXXXX --oneline 查找代码引入的版本
git log -GXXXX --oneline 改变记录
git log -p --filename  文件提交记录
git log -L :searchText:filename
```
