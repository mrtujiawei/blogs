# Shell

## 规范

- 变量尽量大写，区分函数
- unset 取消变量
- 全局变量需要 export /etc/profile
- export GENDER="MALE"

## 常用命令

```bash
# 计算 只有整数可以
expr num op num

# 计算任何数
echo "scale=2;141*100/7966"|bc
$((expression))
$((10+20))

# 命令行交互
read -p "login: " username
read -s -p "password: " password
echo ''
echo $username
echo $password

# 数组相关
# 定义
arr=(1 2 3)

# 取值
n=${arr[0]}

# 获取数组个数
${#arr[@]}

# 数组所有下标
${!arr[@]}

# 从第n个打印到最后
${arr[@]:n}

# 从第n个开始打印打印mge
${arr[@]:n:m}

# 简单遍历
for((i = 9; i > -1; i--))
do
  echo -ne "\b\b\b$i"
  sleep 1
done
echo ''

# 数组遍历
read -a arr
for item in ${arr[@]}
do
  echo $item
done

# 命令返回值遍历
for item in `ls /`
do
  echo $item
done

# 关联数组 2.6 kernal支持
declare -A arr
arr=([gender]="male" [name]='tujiawei' [age]=20)
arr[a]='b'

#查看执行过程
bash -x filename

# cut 命令
x=1.5
y=2
tx=`echo "$x*10" | bc | cut -d "." -f1`
ty=`echo "$y*10" | bc`

if [ $tx -eq $ty ]
then
  echo "相等"
else
  echo "不相等"
fi

# test 命令
test
-d 目录是否存在
-f 文件是否存在
-e 文件或目录

for i in r1 r2 r3 r4 cc r5
do
  if [[ $i == r* ]]
  then
    echo $i
  fi
done

#seq
# seq start step end
# 从start 开始 start += step
# 到end 为止

# 函数定义
[function] funcName() {
  [function body]
  params $1 $2 ...
}

# switch-case
case
case $1 in
  tu )
    echo "是本人" ;;
  zhang)
    echo "女朋友" ;;
esac

# scp
# 复制远程电脑上的文件到本地
scp {username}@{remote_url}:remote_path local_path
```

## 行编辑器 sed

```bash
# 命令
# i 当前行上面添加
# a 当前行下面添加
# d 删除
# s 替换
# c 更改 直接改掉
# y 转换 对应位置改  'y/abc/ABC/'
# = 显示行号
# 统计文件行号
```

## awk 编辑器

读取数据一行一行处理,输入多个命令用;分割  
`awk [option] [BEGIN] {program} [END] file`

1. 数据提取(列)
   `$0` 正行文本  
   `$1` 文本中第一个数据字段  
   `$N` 第 N 个数据字段  
   `$NF` 最后一个字段

2. 数据提取(行)
   `awk 'NR==3{print $0 " " $2};NR==5{print $0;print "end"}'`

3. BEGIN END 使用
   `awk 'BEGIN{print "Hello World"}{print "tujiawei"}END{print "process end"}' passwd`

4. awk 数组
   `{array[1]="tujiawei";array[2]=18}`

5. 变量定义
   `-v 'var=val'`  
   `var++ var--`

6. 匹配
   `$1=="root{print $0}"`  
   `模糊匹配 ~`

7. awk 环境变量

`BEGIN{FILEDWIDTHS="1 2 3"}`  
 第一列列宽 1 第二列 2  
 FS 输入字段分割符  
 OPS 输出字段分割符  
 RS 输入记录分割符  
 ORS 输出

8. 流程控制

`{if($1>5)print $0; else print $2)}`

`{for(i=1;i<4;i++){print $i}print "end"}`

`{i=1;sum=0;while(i<4){sum+=$i;i++}print sum}`

9. 小技巧
   打印行号 `{print NR}`  
   打印最后一行 `END{print $0}`  
   打印列数 `NED{print NF}`

## ffmpeg

1. 下载 m3u8 转 mp4  
   `ffmpeg -i 'url' -threads 5 -preset ultrafast xxx.mp4`

2. 转 mp4 到 m3u8  
   `ffmpeg -i qinruzhe.mp4 -codec copy -vbsf h264_mp4toannexb -map 0 -f segment -segment_list qinruzhe.m3u8 -segment_time 9 qinruzhe_%0d.ts`

3. 同类型转换，不只 mp3
   -t 指 output.mp3 的时长
   ffmpeg -i input.mp3 -ss hh:mm:ss -t hh:mm:ss -acodec copy output.mp3

## ssh

1. ssh 端口(9229)映射到本地 9221  
   `ssh -L 9221:127.0.0.1:9229 tujiawei@192.168.3.34`

2. 免密登录
3. 本地生成 ssh-key `ssh-keygen -t rsa`
4. 复制 id_rsa.pub 到远程 ~/.ssh/authorized_keys

## python

<!-- 直接下载网页中的视频 -->

you-get web-url

## apt 配置

````shell
# 搜索软件包
sudo apt-cache search package

# 重新安装
sudo apt-get install package --reinstall

# 修复安装
sudo apt-get -f install

# 删除包及相关配置
sudo apt-get remove package --purge

# 安装相关的编译环境
sudo apt-get build-dep package

# 根新已安装的包
sudo apt-get upgrade

# 生级系统
sudo apt-get dist-upgrade

# 了解该包的依赖
sudo apt-cache depends package

# 查看该包被那些包依赖
sudo apt-cache rdepends package

# 下载该包的源代码
sudo apt-get source package

### 权限 ###

> - 普通文件
> d 目录
> l 连接文件
> c 字符设备
> b 块文件

用户权限:所在组权限:其他组用户权限
如果是文件 1 表示硬连接
如果是目录 表示该目录的子目录的个数

文件大小，如果是目录，统一显示4096

文件最后修改时间

rwx 作用到目录时
r 可以查看
w 可以修改，目录内创建+删除+重命名目录
x 可以进入目录

chown 改变所有者
chgrp 改变组

### 运行级别 ###

0. 关机
1. 单用户(找回丢失密码)
2. 多用户无网络服务
3. 多用户网络服务
4. 保留
5. 图形界面
6. 重启


## 开源协议 ##

> 左边 no  右边 yes

<pre>
                      修改代码后闭源
                    ↙               ↘
              新增代码使用           加版权说明
              相同许可证            ↙          ↘
          ↙               ↘      用自己名       Apache
      修改处加            GPL    字促销
      说明文档                  ↙        ↘
↙               ↘             BSD        MIT
LGPL            Mozilla
</pre>



# shell #

## 变量内容删除 ##

```shell
# 获取变量长度
${#var}

# 移除.之前的所有内容
${var#*.}

# 贪婪匹配
${var##*.}

# 从后往前
${var%*.}

# 贪婪匹配
${var%%*.}

# 切片,获取前5个字符
${var:0:5}

# 第5个到最后
${var:5}

# 替换
${var/n/N}

# 贪婪
${var//n/N}

# 给没值的变量返回默认值
# 不修改变量的值，相当于三元运算符
${var-val}
````

## wait

如果有后台进程，`wait` 会等待后台进程完成后再执行 `wait` 之后的代码

## xinetd

超级守护进程,linux 安全管理

## printenv

打印所有环境变量

## aapt

获取 apk 的信息

## pr

格式化打印

## screen

> 终端分屏

开启分屏模式: 可以接受特定的快捷键

```sh
$ screen
```

上下分屏: `<C-a><S-s>`  
切换屏幕: `<C-a><tab>`  
新建终端: `<C-a>c`  
关闭终端: `<C-a>x`

## tmux

> 终端分屏，支持上下左右

开启分屏模式: 可以接受特定的快捷键

```sh
$ tmux [-c {some commands]
```

> pane
> 上下分屏: `<C-b>"`  
> 左右分屏: `<C-b>%`  
> 切换屏幕: `<C-b>o`  
> 关闭终端: `<C-b>x`  
> 分屏模式切换: `<C-b><space>`  
> 显示窗口列表: `<C-b>w`
> 断开连接: `<C-b>d`
> 返回到上一个 session: `<C-b>l`
> 滚动: `<C-b>[`

> 显示所有会话
> `tmux list-sessions`

> 关闭服务(关闭所有会话)
> `tmux kill-server`

> 新建会话 -d 后台创建 -s 给会话命名
> `tmux new-session [-d] [-s {name}]`

> session 之间跳转
> 往下一个 session 跳: `<C-b>)`
> 往上一个 session 跳: `<C-b>(`

> 连接和断开 session
> 连接: tmux attach
> 断开: tmux detach

> 切换会话
> `tmux switch-client -t {name}`

> 新建 window -n window 命名
> `tmux new-window [-n {name}]`  
> 新建窗口: `<C-b>c`
> 下一个窗口: `<C-b>n`  
> 上一个窗口: `<C-b>p`  
> 跳转到#窗口: `<C-b>#`

## tldr

`apt install tldr`

常见命令行用法
[tldr command]


## nmap 

- ip扫描
- 端口扫描

## 目录扫描

- dirsearch
- fuzz


## ssh 免密配置

> 在目标主机 ~/.ssh/authorized_keys 中添加 id_rsa.pub 中的秘钥
> 在自己电脑上 ~/.ssh/config 中添加一些配置

```config
Host [hostname]
  HostName [ip]
  Port [port]
  User [user]
```

## eDEX-UI

炫酷的终端仿真器
