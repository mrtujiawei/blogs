# Git 操作 #

因为经常搞错`git branch` 和 git checkout`,所以在这里做个记录

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
