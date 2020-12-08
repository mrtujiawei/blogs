# vim #

现在打算是保存一下现在的vim配置


TOhtml
 将当前文本转化为html，保留现有的格式

生成文件目录
 ! mkdir -p %:h
 我只知道-p 参数 和 %
 对于h参数并不清楚
 但是能够让最后一级生成的是文件而不是目录

# vimrc #

## 变量定义 ##

### 标量变量 ###

b:name  对当前buffer有效
w:name  窗口
g:name  全局
v:name  预定义
a:name  参变量

### 特殊含义变量 ###

$NAME 环境变量
&name 选项
@r 寄存器

### 变量赋值 ### 

:let name=value

### 取消赋值 ###

:unlet! name

## 命令行命令 ##
vim -c 'cmd'

map :普通模式和可视模式其作用
nmap :normal模式映射
vmap :visual模式映射
imap :insert模式映射

# sublime text #

# shell #

`cd -` 返回上次的工作路径


#!/bin/bash
# 写一些初始化系统的操作
# 以后直接拿着这个脚本就可以完成所有软件的安装
# @filename: init.sh
# @author: Mr Prince
# @date: 2020年08月05日 星期三 19时58分43秒

# 安装指定版本的 node
# 修改版本改 15
wget -qO- https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装yarn是为了代码提示
npm i -g yarn

# 安装vim 尽量装最新的，因为插件不支持旧版的
sudo add-apt-repository ppa:jonathonf/vim
sudo apt-get update
sudo apt-get install vim
# 为了剪切板
sudo apt-get install vim-gtk

# 初始化vim的临时文件
mkdir ~/.vim
mkdir ~/.vim/.backup
mkdir ~/.vim/.swp
mkdir ~/.vim/.undo

# 复制一波自己写的脚本
# 要是git能下载快一点就好了
cd && git clone git@github.com:Mr-Promise/script.git
chmod +777 script/npm/toggle-npm-mirror
sudo cp script/npm/toggle-npm-mirror /usr/bin/
rm script
cd - # 回到之前的目录

# 放在下面的原因是安装的时候会进入vim
# 后面的脚本就执行不下去了
# 安装vundle vim包管理工具 
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim

# coc-snippets 配置 需要尝试多次yarn 安装或者改个权限
# vim :CocInstall coc-json coc-tsserver coc-html coc-css coc-vetur

sudo cp vimrc /etc/vim/vimrc
sudo vim -c ":CocInstall coc-json coc-tsserver coc-html coc-css coc-vetur"
# 复制配置文件到相关目录下

# ranger
# install => python3 setup.py
# 非常酷的文件浏览器
sudo apt-get install ranger

# cmatrix 黑客帝国特效
sudo apt-get install cmatrix

# sshpass ssh输入密码


#!/bin/bash
# @filename: private-npm.sh
# @author: Mr Prince
# @date: 2020年08月11日 星期二 15时58分08秒
# 私有npm库搭建

npm i verdaccio -g

# 修改配置文件
# 在node安装目录下的bin
# 加上listen: 0.0.0.0:4873 端口号可以自己定
# 加上下面这几行
# 表示找不到就去共有库找
# uplinks:
#   npmjs:
#     url: https://registry.npmjs.org/
#   yarn:
#     url: https://registry.yarnpkg.com/
#   cnpm:
#     url: http://r.cnpmjs.org/
#   taobao:
#     url: https://registry.npm.taobao.org/
# /node-path/bin/verdaccio # 启动
# 根据提示创建账号 发布代码


#Filename: termux-install.sh
#Author: Mr Prince
#Date: 2020-08-17 16:43:15


# 安装sshd服务
pkg install openssh 

# 修改登陆密码
passwd

# 修改源
vi $PREFIX/etc/apt/source.list
deb [arch=all,aarch64] https://mirrors.ustc.edu.cn/termux stable main

# 修改启动问候语
vi $PREFIX/etc/motd

# 修改key_board
echo "extra-keys = [['ESC', '\$', '+', '-','=', '/', 'BACKSPACE','HOME','END'],['{', '}','[',']','(', ')','UP','<','>'],['TAB', 'CTRL', 'ALT', '&','\"','LEFT', 'DOWN', 'RIGHT','ENTER']]" > $HOME/.termux/termux.properties

# 设置外存储
termux-set-storage

# 设计开机启动脚本
# 通过sshd 判断是否是第一次开机
SSHD_LOG="$PREFIX/tmp/sshd.log"
SERVER_LOG="$PREFIX/tmp/server.log"
if test "`export | grep ssh  -i`"
then
  echo "sshd is already start" >> $SSHD_LOG
else
  echo "sshd is starting" >> $SSHD_LOG
  sshd
  # 启动脚本在这里加
  echo "sshd is started" >> $SSHD_LOG
fi

# 安装软件 
pkg install git nodejs


" ======= 兼容配置 =======
" let g:skip_defaults_vim = 1 " 取消加载defaults.vim
runtime! debian.vim           " 兼容性设置 尽量不要删除
" set compatible 	      	    " 兼容vi 不推荐
set nocompatible              " 不兼容vi

" ======= 插件配置 =======
filetype off
set rtp+=/home/tujiawei/.vim/bundle/Vundle.vim   " 设置vundle 运行环境和路径
call vundle#begin()           " 插件列表开始
  Plugin 'VundleVim/Vundle.vim' " 必须
  Plugin 'preservim/nerdtree', { 'on': 'NERDTreeToggle' } " 文件树
  Plugin 'Xuyuanp/nerdtree-git-plugin' " git状态显示
  Plugin 'mhinz/vim-signify' " 差异显示(文件)
  Plugin 'rhysd/conflict-marker.vim' " git冲突解决
  Plugin 'mattn/emmet-vim' " emmet插件
  Plugin 'hail2u/vim-css3-syntax' " css3
  Plugin 'jiangmiao/auto-pairs' " 括号匹配
  Plugin 'neoclide/coc.nvim', {'branch': 'release'} " 代码补全
  Plugin 'maxmellon/vim-jsx-pretty' " jsx语法高亮
  Plugin 'vimcn/vimcdoc', {'branch': 'release'}  " 中文文档
  " Plug 'pangloss/vim-javascript', { 'for' :['javascript', 'vim-plug'] } " 代码提示？coc里已经有了
  
  " nerdtree-git-plugin 配置
  " 如果只有一个NERDTree窗口，就直接关闭
  let g:NERDTreeShowLineNumbers=1
  let g:NERDTreeGitStatusUseNerdFonts = 1
  "let g:NERDTreeShowIgnoredStatus = 0 " 过时，用下面这个
  let g:NERDTreeGitStatusShowIgnored = 0
  " let g:NERDTreeGitStatusUntrackedFilesMode = 'all'  "
  " 显示单个文件的更改,用了会很卡
  
  let g:NERDTreeGitStatusIndicatorMapCustom = {
     \ 'Modified'  :'✹',
     \ 'Staged'    :'✚',
     \ 'Untracked' :'✭',
     \ 'Renamed'   :'➜',
     \ 'Unmerged'  :'═',
     \ 'Deleted'   :'✖',
     \ 'Dirty'     :'✗',
     \ 'Ignored'   :'☒',
     \ 'Clean'     :'✔︎',
     \ 'Unknown'   :'?',
     \ }

  " 可以进vim 直接打开侧边栏，但不好用
  " 如果是由一个用户窗口就直接关闭vim
  autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
call vundle#end()             " 插件列表结束

" ======= 页面配置 =======
set number                    " 显示行号
set relativenumber            " 显示相对行号

set textwidth=1000000         " 超过后加换行符
set wrap                      " 多行显示 不加换行符
set scrolloff=5               " 上下间距
set sidescrolloff=15          " 横向滚动时空出的行数
set wrapmargin=2              " 折行处与窗口右边缘空出的字符

set t_Co=256                  " 256色
set termguicolors             " 更好看一点,会导致代码提示非常的亮眼 --。 眼睛会瞎
" set background=dark         " 深色背景

set laststatus=1              " 状态栏 0 -> 不显示 1 -> 多窗口显示 2 -> 显示
set ruler                     " 显示光标当前位置
set showcmd                   " 显示操作命令
set showmode                  " 现实模式
set splitright                " 光标直接在右边

" ======= 搜索配置 =======
set hlsearch                  " 高亮匹配
set ignorecase	              " 搜索忽略大小写
set incsearch		              " 搜索时自动滚动屏幕到匹配的行
set showmatch		              " 显示匹配的字符
set smartcase		              " 没有大小写区别时忽略大小写，否则不忽略

" ======= 文件配置 =======
set autochdir                   " 自动切换到当前文件夹下
" set autowrite	  	            " 切换缓冲区时自动保存
set encoding=utf-8              " 文件编码 utf-8
set hidden		                  " 允许有未保存的修改时可以切换缓冲区

set history=1000                " 保存操作历史
set undofile                    " 设置undo的文件，关闭后重新打开还能够撤销

set backupdir=~/.vim/.backup//  " 统一放置备份文件 // 表示文件带有绝对路径，用%替换/
set directory=~/.vim/.swp//     " 统一放置交换文件
set undodir=~/.vim/.undo//      " 统一放置undo文件


" ======= 编辑配置 =======

set autoindent                  " 自动缩进
set autoread                    " 文件监视，修改后提示
set backspace=2                 " backspace可以删除到上一行
" set cursorline                " 高亮当前行
set clipboard=unnamedplus       " 直接使用系统剪切板 需要安装vim-gtk
set expandtab                   " tab转space
set foldenable                  " 允许折叠
set foldmethod=indent           " 手动折叠
set foldlevel=7                 " 超过7层自动折叠
set smartindent                 " 智能缩进

set mouse=a		                  " 支持鼠标操作
set shiftwidth=2                " tab宽度
set softtabstop=2               " 连续的space当成tab来看，可以同时删
set tabstop=2                   " \t的宽度
set wildmenu                    " 命令模式下,tab补全
set wildmode=longest:list,full  " 第一次显示列表，之后依次选下一个

" ======= 快捷键配置 =======
set magic
nmap  :NERDTreeToggle<CR>
map <C-l> :tabnext<CR>
map <C-h> :tabprevious<CR>

" ======= 脚本配置 =======
filetype indent on              " 文件类型检查

if filereadable("/etc/vim/vimrc.local")
  source /etc/vim/vimrc.local " 如果文件存在,加载全局配置文件
endif

if filereadable('~/.vim/.vimrc')
  source ~/.vim/.vimrc
endif

if has("syntax")
  syntax on " 开启语法高亮
endif

if has("autocmd")
  filetype plugin indent on " 加载插件自动缩进规则
  " 第二次打开回到上次编辑的位置
  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif 
  " au InsertLeave * se nocul " 用浅色高亮当前行
  " au InsertEnter * se cul   " 用浅色高亮当前行
  au BufNewFile * :call SetTemplate()
  au FileType * :call SetRunCommand()
  au FileType * :call SetCommentCommand()
  " au vimenter * NERDTree " 进文件自动打开文件目录
endif

" ======= 函数定义 =======

" 页面模板
func SetTemplate()
  " 搞笑
  " * 本人学识渊博、经验丰富，代码风骚、效率恐怖，
  " * c/c++ c#、java、php 安卓 ios  python node.js  无不精通玩转，
  " * 熟练掌握各种框架，并自写语言，创操作系统 写cpu处理器构架，做指令集成  。
  " * 深山苦练20余年，一天只睡3小时，千里之外定位问题，瞬息之间修复上线。
  " * 身体强壮、健步如飞，可连续工作100小时不休息，讨论技术方案9小时不喝水，
  " * 上至研发cpu芯片、带项目、出方案  弄计划，下至盗账号、黑网站、
  " * shell提权挂马、攻击同行、拍片摄影、泡妞把妹纸、开挖掘机 、威胁pm，啥都能干。
  " * 泡面矿泉水已备好，学校不支持已辍学，家人不支持已断绝关系，老婆不支持已离婚，
  " * 小孩不支持已送孤儿院，备用电源万兆光纤永不断电断网，门口已埋地雷无人打扰
  "
  " 计算机历史
  " * Jeff Dean builds his code before committing it, but only to check for compiler and linker bugs.
  " * Jeff还是会在提交代码前把它们编译一遍，不过这么做的目的只是为了检查下编译器和链接器有没有bug
  " 
  " * Compilers don’t warn Jeff Dean. Jeff Dean warns compilers.
  " * 编译器从来不给Jeff编译警告，而是Jeff警告编译器
  if &filetype == 'sh'

    " #!/bin/bash
    " #Filename: index.sh
    " #Author: Mr Prince
    " #Date: 2020-09-02 14:04:37

    call setline(1,"\#!/bin/bash") 
    call append(line("."), "\#Filename: ".expand("%")) 
    call append(line(".")+1, "\#Author: Mr Prince") 
    call append(line(".")+2, "\#Date: ".strftime("%Y-%m-%d %T")) 
    call append(line(".")+3, "")
    normal G
  elseif &filetype == 'javascript'

    " /**
    "  * 
    "  * @filename: index.js
    "  * @author: Mr Prince
    "  * @date: 2020-09-02 14:05:08
    "  */

    call setline(1, "\/**")
    call append(line("."), "\ * ")
    call append(line(".")+1, "\ * @filename: ".expand("%"))
    call append(line(".")+2, "\ * @author: Mr Prince")
    call append(line(".")+3, "\ * @date: ".strftime("%Y-%m-%d %T"))
    call append(line(".")+4, "\ */")
    call append(line(".")+5, "")
    normal 2ggA
  elseif &filetype == 'vue'

    " <template>
    " 
    " </template>
    " 
    " <script>
    " 
    " </script>

    call setline(1, "\<template>")
    call append(line("."), "")
    call append(line(".")+1, "</template>")
    call append(line(".")+2, "")
    call append(line(".")+3, "<script>")
    call append(line(".")+4, "")
    call append(line(".")+5, "</script>")
    normal 2ggA
  endif
endfunc

" 设置运行快捷键的命令
func SetRunCommand()
  if &filetype == 'sh'
    nmap  :w:!sh % > /tmp/vim.run.log:vsp /tmp/vim.run.log
  elseif 'javascript' == &filetype
    nmap  :w:!node %  > /tmp/vim.run.log:vsp /tmp/vim.run.log
  elseif 'html' == &filetype
    nmap  :w:!google-chrome-stable %
  elseif 'java' == &filetype
    nmap  :w:!javac % && java %:r
  endif
  imap  
endfunc

" 设置注释快捷键
func SetCommentCommand()
  if 'html' == &filetype
    nmap  I<!-- A -->F 
    vmap  I<!-- gvAA -->F 
    let g:mapleader=' '
    nmap <leader> ^5x$4h4x
    vmap <leader> $xxxxgvo5x
    let g:mapleader='\'
  elseif 'javascript' == &filetype
    nmap  I// 
    let g:mapleader=' '
    nmap <leader> ^3x
    let g:mapleader='\'
  endif
endfunc


" 文件自动保存到本地
func Commit(operate, message)
  :w
  exec ":!git add ".expand('%')." && git commit -m  ".'"'.a:operate.'('.expand('%:p').'):'.a:message.'"'
endfunc

" 提交到远程分支
func Push()
  :!git push
endfunc

" ======= 自定义命令 =======

command! -n=+ -complete=dir -bar GitCommit :call Commit(<f-args>)
command! -n=0 -complete=dir -bar GitPush :call Push()


" ======= 测试命令 =======

func Test(arg1, arg2)
  echo a:arg1
endfunc

command! -n=+ -complete=dir -bar Test :call Test(<f-args>)
