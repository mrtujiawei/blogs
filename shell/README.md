# Shell #

## 规范 ##

* 变量尽量大写，区分函数  
* unset 取消变量  
* 全局变量需要export /etc/profile  
* export GENDER="MALE"  

## 常用命令 ##

```bash
# 返回上次的工作路径
cd -

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