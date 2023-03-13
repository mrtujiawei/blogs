# Git

提升 github 下载速度:

- 倒入 gitee 然后下载
- 改镜像 在 github.com 后面加后缀: github.com.cnpmjs.org

## 常用命令解释

- `git branch`: 分支的操作,如创建、查看等

  - 列出本地分支， 当前分支前会有 \*
  - `-r`: 查看远程版本分支列表
  - `-a`: 查看所有
  - `dev`: 创建`dev`分支
  - `-d dev`: 删除`dev`分支
  - `-vv`: 查看本地分支对应的远程分支
  - `-m old new`: 重命名

- 删除远程分支

  - `git push origin [空格]:[分支名]`

### 回退相关

```
git reflog 查看历史提交
git reset --hard HEAD~1 回退到上一个版本
```

## git 操作

```bash
# 恢复修改前
git checkout -- <filename>

# 丢弃保存到暂存区的修改
git reset HEAD <filename>

# 回退一个版本: 修改版本库，修改暂存区，修改工作区
git reset --hard HEAD~1

# 回退到指定版本
git reset --hard commit_id

# 撤销前一次提交
git revert HEAD

# 撤销前前一次提交
git revert HEAD^

# 撤销指定版本
git revert commit-id

# 分支比较
git diff [branch] [branch]

# 暂存未提交的修改
git stash

# 查看stash
git stash list

# 使用暂存的修改，栈顶移除
git stash pop

# 清空
git stash clear

# 定位错误版本
git bisect 查找错误出现的版本
git bisect [bad|good]

git blame 查看代码责任人

git grep 查找指定的代码
git log -SXXXX --oneline 查找代码引入的版本
git log -GXXXX --oneline 改变记录
git log -p --filename  文件提交记录
git log -L :searchText:filename

```

## git 分支命名规范

- branch types
  - master: 主分支，永远是可用的最新版本，不建议直接在该分支上开发
  - develop: 集成分支，开发主分支，所有新功能以这个分支来创建自己的功能分支，该分支只做合并操作，不建议直接在该分支上开发
  - feature: 功能分支，在 develop 上创建分支，以开发功能模块命名，功能测试正常后合并到 develop 分支
  - hotfix: 修复分支，紧急 bug 修改分支，在 master 分支上创建，修复完成后合并到 master

## CI 配置

```yml
# 执行流程
stages:
  - install
  - build
  - deploy

# 缓存目录或文件
cache:
  paths:
    - node_modules
    - build

install-job:
  stage: install
  script:
    - echo "install"

build-job:
  stage: build
  script:
    - echo "build"

deploy-job:
  stage: deploy
  script:
    - echo "deploy"
```
