# CSS #

纯css效果: https://lhammer.cn/You-need-to-know-css/#/zh-cn/

## 视口相关 ##

* 布局视口: `documnet.documentElement.clientWidth`
* 视觉视口: `document.innerWidth`

## 适配方案 ##

1. rem适配

```css
// 1物理像素实现
@media screen and (-webkit-device-pixel-ratio : 2) {}

/* y轴可以缩放,x轴不行 */
* { 
  touch-action: pan-y; 
}
```

```javascript
// 动态设置
let style = document.createElement('style');
style.innerHTML = `html{font-size: ${document.documentElement.clientWidth / 10}px !important;}`;

document.head.appendChild(style);

// 阻止默认事件,如滚动
elem.addEventListener('touchstart', fn, { passive: false });
```

2. viewport适配

```javascript
// 将所有视口的宽度调整为设计图宽度
// 需要在页面上写好 <meta name="viewport" content="width=device-width">
// 是为了获取理想视口的宽度， 如果不写这句话，布局适口默认为980
let targetWidth = 750;
let meta = document.querySelector('meta[name=viewport]');
let scale = document.documentElement.clientWidth / targetWidth;
meta.content = `initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},user-scalable=no`;
```

3. amfe-flexible 

> 移动端适配, 用px做单位, 自动转换成rem  
> 最近发现连作者都不提倡用这个了，推荐直接rem

## Bug ##

* font boost

> 当文本数量太多时，会出现字体变大, 解决方式： `max-height: 100%;`

* 圆角过圆

> 移动端设置border-radius: 2px;时 显示近似圆型 解决方式： `appearence: none;`

* margin 塌陷

> 垂直方向外边距重叠时，设置margin不起作用  
> 解决方式： 触发一个盒子的bfc(block format content)  
> 以下任意一种即可 `position:absolute;` `display:inline-block;` `float:left/right;` `overflow:hidden;`   
> 让上下的margin不相邻，border分割 `border-top: 1px;` 


## 特殊样式 ##

```css
:placeholder-show {
  /*
    当强输入没有输入内容
    显示占位文本的输入框
    与:not连用可以实现浮动标签的效果 
  */
}

/* transition可以分别设置多个属性 */
transition: property delay, property delay;

/* 文字描边 */
-webkit-text-stroke: 2px black;

```
- 背景颜色只显示在字上
```css
background-clip: text;
```
- 1物理像素

```css
background: url(
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='5' fill='none' stroke='red' /></svg>"
);
```

- 如果字体不居中，可以试试 

```css
leading-trim: both;
```

- 指定多列
```css
columns 可以指定一列最多一个字符
```

- 背景混合
```css
  background-blend-mode: overlay;
  background-blend-mode: screen;
  background-blend-mode: multiply;
```

- 倒影

```css
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
```

- 没有内容的a标签自动填充href

```css
a[href^=http]:empty::before {
  content: attr(href);
}
```
- 隐藏滚动条

```css
::-webkit-scrollbar {
    display: none
}
```

- 去掉点击时的背景颜色

```css
-webkit-top-highlight-color: rgba(0, 0, 0, 0);
```

- 控制编辑区域的

```css
::-webkit-datetime-edit
```

- 控制年月日这个区域的

```css
::-webkit-datetime-edit-fields-wrapper
```

- 这是控制年月日之间的斜线或短横线的

```css
::-webkit-datetime-edit-text
```

- 控制月份

```css
::-webkit-datetime-edit-month-field
```

- 控制具体日子

```css
::-webkit-datetime-edit-day-field
```

- 控制年文字, 如2017四个字母占据的那片地方

```css
::-webkit-datetime-edit-year-field
```

- 这是控制上下小箭头的

```css
::-webkit-inner-spin-button
```

- 这是控制下拉小箭头的

```css
::-webkit-calendar-picker-indicator
```

- 这是控制清除按钮的

```css
::-webkit-clear-button
```

- 多行溢出隐藏,需要定宽

```css
width: 10em;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
```

- 单行文本溢出

```css
.over {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

- 没有css仍能看到提示

```css
.no-css {
  text-indent: 100%;
  overflow: hidden;
  white-space: nowrap;
}
```

- 倒影

```css
.class {
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
}
```

- 色调旋转（其实就是改个颜色）

```css
.class {
  filter: hue-rotate(115deg);
}
```

- 背景混合？？

```css
mix-bleen-mode: screen;
```

## 布局 ##

### 多列文本 ###

```css
.para {
  /*分割成3列*/
  column-count: 3;
  /*每列宽度为30em*/
  column-width: 30em;
  /*上面两个可以简写成  column: 30em 3;*/

  /*列之间的间隙为2em*/
  column-gap: 2em;

  /*分割列的样式*/
  column-rule: 1px solid #ccc;
}
```
## css属性值后的参数 ##

### 多个参数的情况 ###

*  上右下左（4个）

*  上（左右）下（3个）

*  （上下）（左右）（2个）

### 属性计算 ###

1. 确定声明值  

  - 浏览器默认样式
  - 作者样式
  - 没有冲突的直接作为属性行

2. 层叠冲突

  - 比较重要性
  - 比较特殊性
  - 比较源次序

3. 使用继承

    - 能够继承的实行,使用父元素的属性

4. 使用默认值

### 计算规则 ###

!important>行间样式>id>class=属性选择器>标签选择器>通配符

1. !important   infinity (256进制)
2. 行间样式 　　  　　  1000
3. id   　　　　　  　100
4. class|属性|伪类 　 10
5. 标签|伪元素 　　　  1
6. 通配符  　　　　　  0

### 浮动 ###

浮动元素产生浮动流，所有产生了浮动流的元素,

块级元素看不到他们。

产生了bfc的元素和文本类属性的元素，

以及文本能看到浮动元素。

块级元素才能清除浮动

`position: absolute`自动把元素转换成`block`

### 多张背景图适配 ###

```css
.box {
    background-image: 
      -webkit-image-set(url('http://img2.imgtn.bdimg.com/it/u=1755950913,3513678573&fm=26&gp=0.jpg') 1x,                    
                        url('http://img5.imgtn.bdimg.com/it/u=3618655323,3741137898&fm=26&gp=0.jpg') 2x);
}
```

### 文字两端对齐 ### 

```css
text-align-last: justify;
```

### 文字排版方向 ###

```css
writing-mode: vertical-rl | vertival-lr;
```

### css计数 ###

```css
div {
  /* 重置计数器成0 */
  counter-reset: title; 
}
h3:before {
  /* 增加计数器值 */
  counter-increment: title;
  /* 显示计数器 */
  content: "Title " counter(title) ": "; 
}
```

## 背景 ##

### 画布 ###

特点：

1. 最小宽度为视口宽度

2. 最小高度为视口高度

### HTML元素背景 ###

特点：

1. 覆盖画布

### body元素背景 ###

特点：

1. 如果HTML元素有背景，body元素正常显示（背景覆盖边框盒）

2. 如果HTML元素没有背景，body元素的背景覆盖画布

### 画布背景图(body) ###

特点：

1. 背景图的宽度百分比，相对于视口

2. 背景图的高度百分比，相对于网页高度

3. 背景图的横向位置百分比、预设值都相对于视口

4. 背景图的纵向位置百分比、预设值都相对于网页的高度

## 堆叠上下文 ##

> 堆叠上下文的排列规则,越往下显示比重越高

1. 创建堆叠上下文的元素的背景和边框

2. 堆叠级别为负值的堆叠上下文

3. 常规流非定位块盒

4. 非定位的浮动盒子

5. 常规流非定位行盒

6. 任何z-index为auto的定位子元素,以及z-index是0的堆叠上下文

7. 堆叠级别为正值的堆叠上下文

> 每个堆叠上下文互相独立,不能相互穿插

## grid 布局 ##

```css
.grid {

  /**
   * 定义 grid 布局
   */
  display: grid;

  /**
   * 每列的宽度 
   * repeat(auto-fill, 100px);
   * 1fr 2fr; 比例，后一个是前一个的两倍
   * minmax(100px, 1fr); 长度范围 100px ~ 1fr
   * auto; 浏览器决定
   * [c1] 100px [c2] 200px [c3] 300px; 网格线名称
   */
  grid-template-columns: 100px 100px 100px;

  /**
   * 每行的宽度
   * 
   */
  grid-template-rows: repeat(3, 100px);

  /**
   * 行间隔
   */
  grid-row-gap: 20px;

  /**
   * 列间隔
   */
  grid-column-gap: 20px;

  /**
   * 间隔
   */
  grid-gap: 20px 20px;

  /**
   * 给单元格命名
   * 用不上的用 `.`
   * 会影响网格线名称
   * 变为xx-start xx-end
   */
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
  
  /**
   * 优先排列 (row: 行)
   * row dense; dense 尽可能填满，尽量不出现空格
   * column dense; 
   */
  grid-auto-flow: column;

  /**
   * 水平对齐方式
   * start | end | center | stretch
   */
  justify-items: start;

  /**
   * 垂直对齐方式
   * start | end | center | stretch
   */
  align-items: end;

  /**
   * <align-items> <justify-items>;
   */
  place-items: center stretch;

  /**
   * 整个区域内容的水平位置
   */
  justify-content: center;
  
  /**
   * 整个区域内容的垂直位置
   */
  align-items: space-between;

  /**
   * <justify-content> <align-items>
   */
  place-content: center space-between;

  /**
   * 浏览器自动生成的多余的网格高度
   */
  grid-auto-columns: 50px;

  /**
   * 浏览器自动生成的多余的网格宽度
   */
  grid-auto-rows: 50px;

  /**
   * grid-template <grid-template-columns> <grid-template-rows> <grid-template-areas>;
   *
   * grid: <grid-template-rows> <grid-template-columns> <grid-template-areas> <grid-auto-rows> <grid-auto-columns> <grid-auto-flow>;
   */
}

.grid .grid-item {
  /**
   * 项目的位置对应的左网格线
   * 下标从1开始
   * 可以制定为网格线名字
   * span 2; 跨越两个网格
   */
  grid-column-start: 2;

  /**
   * 右网格线
   */
  grid-column-end: 4;

  /**
   * 上网格线
   */
   grid-row-start: 1;

   /**
    * 下网格线
    */
    grid-row-end: 2;
    
    /**
     * grid-row: <grid-row-start> <grid-row-end>;
     * grid-column: <grid-column-start> <grid-column-end>;
     */
  /**
   * 指定放置的单元格,或:
   * grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
   */
    grid-area: e;

    /**
     * 单元格内水平对齐方式
     */
    justify-self: start;
    
    /**
     * 垂直对齐方式
     */
    align-self: end;

    /**
     * place-self: <justify-self> <align-self>;
     */
}
```

```css
.class-name {
  /* 生成的单独的图层 */
  will-change: transform;
  /* 隔离指定内容的样式,布局和渲染 */
  contain: strict;
}
```

ios 有多个滚动容器时卡顿

```css
-webkit-overflow-scrolling: touch;
```


```css
// viewport-fit=cover条件
env(safe-area-inset-top);
```
### css灵感 ###

1. you need to know css  
2. css-inspiratioin   
3. css ticks  
4. spinkit  
5. animista  

## IPhone 适配 ##

https://webkit.org/blog/7929/designing-websites-for-iphone-x/

## CSS ##

```css
// 文字模糊
.blur {
  color: transparent;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5)
}

// 禁用鼠标事件，禁止图片长按保存
.no-events {
  pointer-events: none
}

// 禁用文字选择
.unselect {
  user-select: none;
}

// 文字渐变
.text-gradient {
  background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgb(63, 52, 219)), to(rgb(233, 86, 86)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

// 手持设备定制特殊样式
<link type="text/css" rel="stylesheet" href="handheldstyle.css" media="handheld">

// 超出N行显示省略号
.hide-text-n {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: n;
  overflow: hidden
}

// 移动端顺畅滚动
.scroll-touch {
  -webkit-overflow-scrolling: touch
}

// 移动端pointer型元素，去除点击高光
* {
  -webkit-tap-highlight-color: transparent
}

// 清除浮动
.clearfix::after {
  content: '';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both
}

// 使用伪元素扩大点击热区
.btn {
  position: relative
}

.btn::befoer{
  content: "";
  position: absolute;
  top: -1rem;
  right: -1rem;
  bottom: -1rem;
  left: -1rem
}

// 伪元素换行
.br::after{
  content: "A";
  white-space: pre
}
```

```css
/* 
  <input class='switch-component' type='checkbox'>
*/

/* 背景层 */
.switch-component {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: #dadada;
  border-radius: 30px;
  border: none;
  outline: none;
  -webkit-appearance: none;
  transition: all .2s ease;
}

/* 按钮 */
.switch-component::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  transition: all .2s ease;
}

/* 选中状态时，背景色切换 */
.switch-component:checked {
  background-color: #86c0fa;
 }

/* 选中状态时，按钮的位置移动 */
.switch-component:checked::after {
  left: 50%;
}
```

```css
/* 适配深色模式 */
@media (prefers-color-scheme: dark) {

}
```
