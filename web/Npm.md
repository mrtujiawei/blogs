1. amr播放器 `benz-amr-recorder`  

2. react懒加载

```javascript
import Loadable from 'react-loadable';
/**
 * 本质就是高阶组件
 * component: () => import(src);
 */
export function loadable(component) {
  return Loadable({
    loading: () => null,
    loader: component,
  });
}
```

3. 图表组件

* `echars` canvas
* `highcharts` svg
* `v-charts` 对echars的封装，简化配置项

4. `cheerio`

> 在node中使用的jQuery,爬虫用

5. `css酷炫动画` `https://chokcoco.github.io/CSS-Inspiration/#/./init`

6. `HTML 常用转义字符` `http://114.xixik.com/character/`

7. `node-sass`安装报错

```javascript
//.npmrc
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
electron_mirror=https://npm.taobao.org/mirrors/electron/
registry=https://registry.npm.taobao.org
```

8. `CSS 特殊样式` `http://css-tricks.neatbang.com/`

9. 动画库

- Three.js

- Mo.js

- Anime.js

- Velocity

- Popmotion

- Vivus

- GreenSock JS

- Scroll Reveal

- Hover (CSS)

- Kute.js

- Typed.js

- animation.css

- CSS-Inspiration(https://chokcoco.github.io/CSS-Inspiration/#/)

- animejs 轻量级的js动画库

15. spy-debugger

16. 移动端调试 `eruda`

## 手机端全屏库 ##

- fullPage.js

- leaflet 交互图

- anime.js

- screenfull.js 全屏功能

- hammer.js 多点触摸手势

- D3.js 数据可视化

- fullpage.js 


- exif.js 判断图片是否反转90度

```javascript
//此处省略HTML
      var Orientation = null;
      var canvasHead = '';
      $('#fileBtn').on('change',function(){
          var files = this.files[0];
          var reader = new FileReader();
          if(typeof FileReader == 'undefined'){
              require('module/common/dialog').showToast('抱歉，您手机暂不支持');
              return;
          }else{
              reader.readAsDataURL(files);
          }
          reader.onloadstart = function(){
              require('module/common/dialog').showLoading('正在读取');
          };
          reader.onabort = function(){
              require('module/common/dialog').hideLoading();
              require('module/common/dialog').showToast('读取中断，请重试');
              return false;
          };
          reader.onerror = function(){
              require('module/common/dialog').hideLoading();
              require('module/common/dialog').showToast('读取发生错误，请重试');
              return false;
          };
          reader.onload = function(){
              require('module/common/dialog').hideLoading();
              require('module/common/dialog').showLoading('读取完成，玩命加载中');
              if(reader.readyState == 2){
                  var fileStr = reader.result;
                  var image = new Image();
                  image.src = fileStr;
                  image.onload = function(){
                      $('#preHead').addClass('preHead');
                      var preHead_canvas = document.getElementById('preHead');
                      var preHead_ctx = preHead_canvas.getContext('2d');
                      $('.fileBtn').addClass('hide');
                      //获取Orientation
                      EXIF.getData(image, function() {
                          Orientation = EXIF.getTag(image, 'Orientation');
                      });
                      //如果没有Orientation 则为Android
                      if(!Orientation){
                          preHead_canvas.width = image.width;
                          preHead_canvas.height = image.height;
                          preHead_ctx.drawImage(image, 0, 0, image.width, image.height);
                      }
                      //如果有Orientation 则为IOS
                      else{
                          switch (Orientation) {
                              case 1:
                                  preHead_canvas.width = image.width;
                                  preHead_canvas.height = image.height;
                                  preHead_ctx.drawImage(image, 0, 0, image.width, image.height);
                                  break;
                              case 3:
                                  preHead_canvas.width = image.width;
                                  preHead_canvas.height = image.height;
                                  preHead_ctx.rotate(Math.PI);
                                  preHead_ctx.drawImage(image, -image.width, -image.height, image.width, image.height);
                                  break;
                              case 6:
                                  preHead_canvas.width = image.height;
                                  preHead_canvas.height = image.width;
                                  preHead_ctx.rotate(Math.PI / 2);
                                  preHead_ctx.drawImage(image, 0, -image.height, image.width, image.height);
                                  break;
                              case 8:
                                  preHead_canvas.width = image.height;
                                  preHead_canvas.height = image.width;
                                  preHead_ctx.rotate(3 * Math.PI / 2);
                                  preHead_ctx.drawImage(image, -image.width, 0, image.width, image.height);
                                  break;
                          }
                      }
                      require('module/common/dialog').hideLoading();
                      canvasHead = preHead_canvas.toDataURL();
                      $('.cameraHead').attr('src',canvasHead);
                      $('#preHead').removeClass('hide');
                  };
              }
          }
      });
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

- Leaflet js 地图库 
- @ffmpeg/ffmpeg 前端ffmpeg库，wasm，不需要安装

- webpack resolveLoader loader查找路径，测试(自定义loader)时比较有用 
- iconv-lite axios 爬虫乱码 设置responseType: 'arraybuffer', iconv.decode('data', 'charset');  
- fanyi 终端翻译工具,需要安装依赖 `sudo apt-get install festival festvox-kallpc16k`,用法: fanyi bike

## travis 

> 一个脚本工具吧，方便自动化处理一些过程

## 发布 beta 版本

在 package.json 里面改版本号
`版本号-beta.0` x.x.x-beta.0

## 安装 beta 版本

`npm i packageName@beta`

## 脚本预处理

package.json 自动控制的流程:  
`pre{cmd}` => `{cmd}` => `post{cmd}`
