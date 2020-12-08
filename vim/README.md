# VIM #

## 命令行命令 ## 

`vim -c 'cmd'`

* map :普通模式和可视模式其作用  
* nmap :normal模式映射  
* vmap :visual模式映射  
* imap :insert模式映射  

## Command ##

* `Tohtml`  
将当前文本转化为html，保留现有的格式

* `:let name=value`  
变量赋值

* `:unlet! name`  
取消赋值

* `mkdir -p %:h`  
创建文件并创建上级目录(如果不存在)

## 变量 ##

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