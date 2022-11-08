# packages

曾经使用过的 npm 包

- webpack

  - `speed-measure-webpack-plugin`: 显示构建速度的插件
  - `source-map-explorer`: 根据打包后的代码，分析代码构成来源
  - `expose-loader`: 向全局中暴露模块

- 下载相关

  - `jszip`: 生成压缩包
  - `file-saver`: 文件下载

- React

  - `formik`: 表单
  - `react-window`: 虚拟列表, 无限滚动

- canvas 框架

  - `konva`: 支持高性能动画、过渡、节点嵌套、分层、过滤、缓存、桌面和移动应用的事件处理等

- WebGL

  - `pixi.js`: WebGL 渲染器, 2D 库,在不了解 WebGL 的情况下享受硬件加速

- 状态机

  - `xstate`: 优先状态机,可视化状态及状态转换

- 输入相关

  - `imask`: 限制输入的内容

- 移动端调试

  - `spy-debugger`
  - `eruda`

- 播放相关

  - `benz-amr-recorder`: 纯前端解码、播放、录音、编码 AMR 音频
  - `@ffmpeg/ffmpeg`: wasm,前端 ffmpeg 库

- 数据可视化

  - `echars`: 基于 JavaScript 的开源可视化图表库，支持 `canvas` 和 `svg`
  - `highcharts`: 兼容 IE6+、完美支持移动端、图表类型丰富、方便快捷的 HTML5 交互性图表库
  - `d3`: web 标准 数据可视化 js 库

- Node.js 相关

  - `cheerio`: Node 环境中的 jQuery
  - `commander`: 命令行工具的完整解决方案
  - `glob`: 路径模式匹配
  - `configstore`: 配置(数据)持久化
  - `inquirer`: 通用命令行交互集合
  - `ngrok`: 公网端口映射，本地端口映射为外部网站端口

- github

  - `@octokit/rest`: REST API 客户端,可在浏览器中使用

- 动画库

  - `animejs`: 轻量级 javascript 动画库
  - `popmotion`: 动画库
  - `gsap`: 现代 web 的专业级动画库
  - `scrollreveal`: 当滚动到视图内的时候播放动画
  - `wowjs`: 滚动到指定位置时播放动画
  - `animejs`: 轻量、简单、功能强大的 js 动画库

- 3D

  - `three`: three.js
  - `aframe`: 用于构建虚拟现实体验的 web 框架

- 文本编辑器

  - `@editorjs/editorjs`
  - `tinymce`

- markdown 编辑器

  - `@milkdown/core`

- 全屏功能

  - `screenfull`: 全屏操作跨浏览器的简单封装
  - `fullpage.js`
  - `leaflet`: 交互式地图

- 手势

  - `hammerjs`: 多点触摸手势

- 图片相关

  - `exif-js`: 提取图片 EXIF 元数据的 js 库, 可判断图片是否反转 90 度
  - `tesseract.js`: wasm, 图像中的文字识别

- 特殊字体

  - `figlet`: 完全实现 FIGfont 的 js 库

- 字符编码转换

  - `iconv-lite`

## 版本管理

> 发布 beta 版: version: `x.x.x-beta.x`

> 安装 beta 版: npm i packageName@beta

## scripts 说明

> 执行流程

`pre{cmd}` => `${cmd}` => `post${cmd}`