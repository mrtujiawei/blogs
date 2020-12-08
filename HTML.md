# HTML #

html相关的东西

## HTML默认折叠效果 ## 

```html
<details open>
  <summary class="title">zhuti</summary>
  <p>this is a zhuti</p>
  <p>this is a zhuti</p>
  <p>this is a zhuti</p>
</details>
```

## meta标签 ##

### 通用meta标签 ###

```html
<!-- 每隔2秒刷新 -->
<meta http-equiv="Refresh" content="2;./index.html">

<!-- 禁止自动识别电话号码和邮箱 -->
<meta name="format-detection" content="telephone=no,email=no">

<!-- 禁止从缓存访问 -->
<meta http-equiv="Pragma" content="no-cache">

<!--  优先使用 IE 最新版本和 Chrome -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

<!--  页面描述 -->
<meta name="description" content="不超过150个字符"/>

<!-- 页面关键词 -->
<meta name="keywords" content=""/>

<!-- 网页作者 -->
<meta name="author" content="name, email@gmail.com"/>

<!-- 搜索引擎抓取 -->
<meta name="robots" content="index,follow"/>

<!-- 为移动设备添加 viewport -->
<meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">

<!-- 设置页面不缓存 -->
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0″>

<!-- 升级http -> https -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

<!-- 启用360浏览器的极速模式(webkit) -->
<meta name="renderer" content="webkit"> 

<!-- 避免IE使用兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge"> 

<!--  不让百度转码 -->
<meta http-equiv="Cache-Control" content="no-siteapp" />

<!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
<meta name="HandheldFriendly" content="true"> 

<!-- 微软的老式浏览器 -->
<meta name="MobileOptimized" content="320″> 

<!--  uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">

<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<meta name="x5-fullscreen" content="true">

<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">

<!--  UC应用模式 -->
<meta name="browsermode" content="application">

<!--  QQ应用模式 -->
<meta name="x5-page-mode" content="app">

<!--  windows phone 点击无高光 -->
<meta name="msapplication-tap-highlight" content="no">
```

### IOS 相关meta标签 ###

```html
<!-- 苹果覆盖背景色,主要是viewport-fit=cover -->
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,user-scalable=no,viewport-fit=cover">

<!-- 苹果手机：会删除默认的工具栏和菜单栏，网站开启对web app的支持 -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- 苹果手机：在web app应用下状态条（屏幕顶部色）的颜色，默认值为default（白色）， -->
<!-- 可以定位black（黑色）和black-translucent（灰色半透明）。 -->
<meta name="apple-mobile-web-status-bar-style" content="black">

<!-- 苹果手机：如果把一个web app添加到了主屏幕中，那么从主屏幕中打开这个web app则全屏显示 -->
<meta name="apple-touch-fullscreen" content="yes">

<!-- iOS 设备 begin -->
<meta name="apple-mobile-web-app-title" content="标题"> 

<!--  添加到主屏后的标题（iOS 6 新增）-->
<meta name="apple-mobile-web-app-capable" content="yes"/>

<!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">

<!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari）-->
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>

<!-- 设置苹果工具栏颜色 -->
<meta name="format-detection" content="telphone=no, email=no"/> 
```


## 性能优化 ##

```html
<!-- 域名预解析 -->
<link rel="dns-prefetch" href="//a.xingqiu.tv">

<!-- 预先建立连接, crossorigin 可以携带 验证信息 cookie-->
<link rel="preconnect" href="//a.xingqiu.tv" crossorigin>

<!-- 预加载资源 -->
<link rel="prefetch" href="//example.com/next-page.html" as="html" crossorigin="use-credentials">
<link rel="prefetch" href="/library.js" as="script">

<!-- 预加载并解析 -->
<link rel="prerender" href="//example.com/next-page.html">
```

## DOM 结构树 ##

![DOM 结构树](/images/dom-tree.png)

## 节点类型 ##

- 元素结点 => 1

- 属性结点 => 2

- 文本结点 => 3

- 注释结点 => 8

- document结点 =>　9

- documentFragment => 11
