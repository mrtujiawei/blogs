# Node #

## debug ##

0. 映射端口号，9221映射到9229上
1. 连上远程服务器: ssh -L 9221:127.0.0.1:9229 tujiawei@192.168.3.34
2. 需要打开chrome devtool
3. node --inspect-brk index.js 或者 node --inspect index.js
