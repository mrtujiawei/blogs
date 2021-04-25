# Shell #

## 规范 ##

* 变量尽量大写，区分函数  
* unset 取消变量  
* 全局变量需要export /etc/profile  
* export GENDER="MALE"  

## 常用命令 ##

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

## 行编辑器sed ##
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

## awk编辑器 ##

读取数据一行一行处理,输入多个命令用;分割  
`awk [option] [BEGIN] {program} [END] file`

1. 数据提取(列)
  `$0` 正行文本  
  `$1` 文本中第一个数据字段  
  `$N` 第N个数据字段  
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
  第一列列宽1 第二列2  
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

## ffmpeg ##

1. 下载m3u8转mp4  
`ffmpeg -i 'url' -threads 5 -preset ultrafast xxx.mp4`

2. 转mp4到m3u8  
`ffmpeg -i qinruzhe.mp4 -codec copy -vbsf h264_mp4toannexb -map 0 -f segment -segment_list qinruzhe.m3u8 -segment_time 9 qinruzhe_%0d.ts`

3. 同类型转换，不只mp3
3. ffmpeg -i input.mp3 -ss hh:mm:ss -t hh:mm:ss -acodec copy output.mp3

## ssh ##

1. ssh端口(9229)映射到本地9221  
`ssh -L 9221:127.0.0.1:9229 tujiawei@192.168.3.34`

## python ##

<!-- 直接下载网页中的视频 -->
you-get web-url

## apt配置 ##

```shell
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

## docker 配置 ##


sudo apt-get install docker.io

# 修改镜像
# /etc/docker/daemon.json

  {
    "registry-mirrors": [
      "https://docker.mirrors.ustc.edu.cn", 
      "https://reg-mirror.qiniu.com", 
      "http://hub-mirror.c.163.com",
      "https://docker.mirrors.ustc.edu.cn"
    ]
  }

# 修改镜像端口映射
# 实际上是改iptable
# 将容器的
iptables -t nat -A  DOCKER -p tcp --dport 81 -j DNAT --to-destination 172.17.0.19:8012

实际访问不能用localhost 需要用指定ip

直接commit 之后再run比较简单
```

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
```

## wait ##

如果有后台进程，`wait` 会等待后台进程完成后再执行 `wait` 之后的代码


## xinetd ##

超级守护进程,linux安全管理

## IPhone 适配 ##

https://webkit.org/blog/7929/designing-websites-for-iphone-x/

## CSS ##

```css
// 文字模糊
.blur {
  color: transparent;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5)
}

// 禁用鼠标事件，禁止图片长按保存
.no-events {
  pointer-events: none
}

// 禁用文字选择
.unselect {
  user-select: none;
}

// 文字渐变
.text-gradient {
  background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgb(63, 52, 219)), to(rgb(233, 86, 86)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

// 手持设备定制特殊样式
<link type="text/css" rel="stylesheet" href="handheldstyle.css" media="handheld">

// 超出N行显示省略号
.hide-text-n {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: n;
  overflow: hidden
}

// 移动端顺畅滚动
.scroll-touch {
  -webkit-overflow-scrolling: touch
}

// 移动端pointer型元素，去除点击高光
* {
  -webkit-tap-highlight-color: transparent
}

// 清除浮动
.clearfix::after {
  content: '';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both
}

// 使用伪元素扩大点击热区
.btn {
  position: relative
}

.btn::befoer{
  content: "";
  position: absolute;
  top: -1rem;
  right: -1rem;
  bottom: -1rem;
  left: -1rem
}

// 伪元素换行
.br::after{
  content: "A";
  white-space: pre
}
```

```css
/* 
  <input class='switch-component' type='checkbox'>
*/

/* 背景层 */
.switch-component {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: #dadada;
  border-radius: 30px;
  border: none;
  outline: none;
  -webkit-appearance: none;
  transition: all .2s ease;
}

/* 按钮 */
.switch-component::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  transition: all .2s ease;
}

/* 选中状态时，背景色切换 */
.switch-component:checked {
  background-color: #86c0fa;
 }

/* 选中状态时，按钮的位置移动 */
.switch-component:checked::after {
  left: 50%;
}
```


## WEB ##

canvas框架 `cax`

## gitlib ci #

安装gitlib runner  
https://docs.gitlab.com/runner/install/linux-repository.html

gitlab-runner install
gitlab-runner start
# 注册相关信息在gitlib setting里面
sudo gitlab-runner register
# 激活
gitlab-runner verify
# 删除 
gitlab-runner verify --delete --name [name]

# 卸载
sudo gitlab-runner uninstall

# 重新安装
sudo gitlab-runner install -u gitlab-runner


# 权限不足修复
ps aux|grep gitlab-runner  #查看当前runner用户

sudo gitlab-runner uninstall  #删除gitlab-runner

sudo gitlab-runner install --working-directory /home/gitlab-runner --user root   #安装并设置--user(例如我想设置为root)

sudo service gitlab-runner restart  #重启gitlab-runner

ps aux|grep gitlab-runner #再次执行会发现--user的用户名已经更换成root了
```
stages:
  - install
  - build
  - deploy
cache: # 缓存
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
