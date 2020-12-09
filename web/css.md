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
