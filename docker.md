# DOCKER #

## 安装 ## 

`sudo apt-get install docker.io`

## docker 配置 ##

修改镜像  
`/etc/docker/daemon.json`
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn", 
    "https://reg-mirror.qiniu.com", 
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

修改镜像端口映射,实际上是改iptable  
```shell
iptables -t nat -A  DOCKER -p tcp --dport 81 -j DNAT --to-destination 172.17.0.19:8012
```
实际访问不能用localhost 需要用指定ip  
直接commit 之后再run比较简单  
```

## 命令 ##

| 命令             | 描述             |
| -                | -                |
| 启动镜像         | `docker run`     |
| 容器执行命令     | `docker exec`    |
| 启动退出的容器   | `docker start`   |
| 停止容器         | `docker stop`    |
| 删除容器         | `docker rm`      |
| 删除镜像         | `docker rmi`     |
| 根据容器生成镜像 | `docker commit`  |
| 导出容器         | `docker save`    |
| 导入容器         | `docker load`    |
| 生成标签         | `docker tag`     |
| 查看日志         | `docker log`     |
| 搜索镜像(hub)    | `docker search`  |
| 端口映射         | `docker run -p`  |
| 传递环境变量     | `docker run -e`  |
| 查看配置         | `docker inspect` |

## Dockerfile ##

| 指令       | 描述                        |
| -          | -                           |
| FROM       | 拉取基准镜像                |
| #          | 注释                        |
| USER       | 指定用户                    |
| WORKDIR    | 指定工作目录,默认进入的目录 |
| ADD        | 本地资源放到指定位置        |
| EXPOSE     | 指定暴露的端口号            |
| RUN        | 生成镜像时执行shell命令     |
| ENV        | 指定环境变量                |
| CMD        | 启动容器时执行的命令        |
| ENTRYPOINT | 指定默认启动脚本            |
