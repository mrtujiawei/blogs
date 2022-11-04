```javascript
//此处省略HTML
```

- 判断是横屏还是竖屏
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>MediaQueryList</title>
</head>
<body>
    <p></p>
    <script>
        var para = document.querySelector('p');
        var mql = window.matchMedia('(max-width: 600px)');
        mql.onchange = function (e) {
            if (e.matches) {
                /* the viewport is 600 pixels wide or less */
                para.textContent = 'This is a narrow screen — less than 600px wide.';
                document.body.style.backgroundColor = 'red';
            } else {
                /* the viewport is more than than 600 pixels wide */
                para.textContent = 'This is a wide screen — more than 600px wide.';
                document.body.style.backgroundColor = 'blue';
            }
        }
    </script>
</body>
</html>
```

- webpack resolveLoader loader查找路径，测试(自定义loader)时比较有用 
- iconv-lite axios 爬虫乱码 设置responseType: 'arraybuffer', iconv.decode('data', 'charset');  
- fanyi 终端翻译工具,需要安装依赖 `sudo apt-get install festival festvox-kallpc16k`,用法: fanyi bike

## 发布 beta 版本

在 package.json 里面改版本号
`版本号-beta.0` x.x.x-beta.0

## 安装 beta 版本

`npm i packageName@beta`

## 脚本预处理

package.json 自动控制的流程:  
`pre{cmd}` => `{cmd}` => `post{cmd}`

## ngrok 

> 外网端口映射，本地端口映射为外部网站端口

## sigma.js

> 点、线 库

## aframe

> 3d VR体验库，可以创建VR场景

## hot key 

> 快捷键绑定

## imask 

> 阻止不合规则的输入

## xstate

> 状态机，实现复杂应用可以用到
> 可以可视化状态及状态转换

## konva

> HTML5 Canvas JavaScript

## pixijs

> webgl 渲染器，貌似已经接近游戏了

## formik

> `react` 表单库，据说效率比较高，写起来比较简单

[formik](https://formik.org/docs/overview)

## react-window

> 虚拟列表, 无限滚动啥的

## 打包下载 zip

```javascript
// 下载
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

async function downloadM3u8(name, uri) {
  const zip = new JSZip();
  const folder = zip.folder(name);

  folder.file(path, content);
  folder.file(path, content);
  folder.file(path, content);

  return new Promise((resolve) => {
    zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, name);
      resolve();
    });
  });
}

```
