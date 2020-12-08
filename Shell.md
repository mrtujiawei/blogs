# Shell #

```shell
#!/bin/bash
# @filename: toggleMirror.sh
# @author: Mr Prince
# @date: 2020年08月08日 星期六 21时37分24秒
# 写一个切换镜像的脚本

if [[ $1 == 'taobao' ]]
then
  npm config set registry http://registry.npm.taobao.org/
  echo '已经切换成淘宝镜像'
else
  npm config set registry https://registry.npmjs.org/
  echo '已经切换成官方镜像'
fi
```

```javascript
/**
 * 自动提交一个文件夹下的所有项目代码
 * @filename: push.js
 * @author: Mr Prince
 * @date: 2020年08月09日 星期日 20时05分36秒
 */

const {execSync} = require('child_process');
const path = require('path');

let dirList = (execSync('ls') + '').split('\n');
dirList.pop();
dirList.forEach(dir => {
  if(path.resolve(__dirname, dir) ==  __filename) {
    return ;
  }
  const options = {
    cwd: path.resolve(__dirname, dir)
  };
  console.log('正在提交', options.cwd, '\n');
  try {
    execSync('git add .', options);
    execSync(`git commit -m 'feat(all)自动提交'`, options);
    execSync('git push', options);
    console.log('提交', options.cwd, '成功', '\n');
  } catch (e) {
    console.log(e.stdout + '');
  }
});
```

# script #

一些简单的脚本，自己处理一些东西用的

## netlify ##

自动打包部署前端项目

## 外包接单 ##

码市：https://mart.coding.net
开源众包：https://zb.oschina.net/projects/list.html
程序员客栈：https://www.proginn.com
开发邦：http://www.kaifabang.com
猿急送：https://www.yuanjisong.com
人人开发：http://rrkf.com
FD自由开发者：https://www.nasxneuf.com/?channel=D2#contact-us

## 提升github下载速度 ##

1. 倒入gitee 然后下载
2. 改镜像 在github.com后面加后缀: github.com.cnpmjs.org

## ffmpeg ##

1. 下载m3u8转mp4
`ffmpeg -i 'url' -threads 5 -preset ultrafast xxx.mp4`
2. 转mp4到m3u8
`ffmpeg -i qinruzhe.mp4 -codec copy -vbsf h264_mp4toannexb -map 0 -f segment -segment_list qinruzhe.m3u8 -segment_time 9 qinruzhe_%0d.ts`


