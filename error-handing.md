# 错误处理

针对工作中出现的问题，处理过程的记录

- `node-sass` 安装报错

  在项目根目录下的 .npmrc 中添加，如果没有 .npmrc 则新建一个

  ```shell
  sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
  phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
  electron_mirror=https://npm.taobao.org/mirrors/electron/
  registry=https://registry.npm.taobao.org
  ```
