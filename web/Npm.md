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
