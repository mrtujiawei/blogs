# javascript #

变量提升（变量的提升过程）
预编译(发生在函数执行的前一刻)

1.创建一个AO对象（Activation Object）

2.找形参和变量声明，将变量和形参名作为AO属性名，值为undefined,

3.将实参值和形参值统一

4.在函数体里面找函数声明，值赋予函数体


(正则表达式)replace方法的第二个参数可以使用美元符号$，用来指代所替换的内容。
  $&：匹配的子字符串。
  $`：匹配结果前面的文本。
  $'：匹配结果后面的文本。
  $n：匹配成功的第n组内容，n是从1开始的自然数。
  $$：指代美元符号$。
  
指定位置上最顶层的元素 
`document.elementFromPoint(x: int, y: int);`
指定位置所有的元素 
`document.elementsFromPoint(x: int, y: int);`
Element.accessKey = 'i'; 
 按下a\t 将焦点转移到Element上

URLSearchParams(params) 不需要手动拼接参数 
  toString()就可以 
  append 可以追加 
  has 可以判断存不存在
  delete 删除指定键值
  set 指定，没有就追加
  get 获取指定键值 
  getAll 获取指定键的所有值，可能会重复值
  sort 根据键排序，键相同按出现顺序排序
  keys
  values
  entries

## 布局抖动 ##

FastDom (DOM操作读写分离)

* 尽量固定函数的参数类型，这样可以让浏览器进行优化
* 懒解析 和 饥饿解析
懒解析:
  不解析函数内部的代码，使用时再解析
饥饿解析:
  立即解析，不延迟(用括号包起来(function test() {})) 不是立即实行函数

对象属性尽量提前定好，不要随便新增属性 (Hidden Class [隐藏类型])

`window.requestIdleCallback()`跟`setTimeout`类似，也是将某个函数推迟执行，但是它保证将回调函数推迟到系统资源空闲时执行。

`Element.getClientRects`返回元素的位置，行内元素返回多个成员，与行数有关,换行符也会算进去

获取元素位置属性

```javascript
getBoundingClientRect()
```

性能监测

```
var observer = new PerformanceObserver( function ( list ) {
    var perfEntries = list.getEntries( );
    for ( var i = 0; i < perfEntries.length; i++ ) {
      console.log(perfEntries[i]);
    }
} );

observer.observe( { entryTypes: [ "longtask" ] } );

for(let i = 0; i < 29900000; i++) {
  // console.log(i);
}
```

## 函数参数传递的步骤 ##

1. 创建对象；

2. 找形参和变量声明，
将变量和形参名作为AO属性名，
值为undefined

3. 将实参值和形参值统一

4. 在函数体里找函数声明，值赋予函数体

## prototype ##

原型是function 对象的一个属性  
它定义了构造函数制造出的对象的共有祖先  
通过该构造函数产生的对象  
可以继承该原型的属性和方法  
原型也是对象  

document的原型  
document --> HTMLDocument.prototype -->Document.prototype


```javascript
DOMParser  =>  parseFromString 转字符串为dom文档
dom.replaceWidh => 替换元素
element.compareDocumentPosition(otherElemnt) 比较位置关系
1. 不在同一个文档内
2. 前
4. 后
8. 包含
16. 被包含
```

判断是否包含指定的选择器

```javascript
let wrap = document.getElementsByClassName('wrap')[0];
let res = wrap.matches('.wrap');
// contains 是否包含另一个元素的子元素
console.log(res);
```

动态插入元素

```javascript
document.body.insertAdjacentHTML( 'beforeend', '<div style="width: 100px;height: 100px; background-color: #008c8c;">这是一个div</div>' );

insertAdjacentElement
insertAdjacentText
```
canvas保留一段时间的特效

```javascript
context.globalCompositeOperation = 'destination-out';
// 之前的轨迹透明，之后的轨迹部分显示
context.fillStyle = 'rgba(0, 0, 0, 0.5)';
context.fillRect( 0, 0, cw, ch );
context.globalCompositeOperation = 'lighter';
```

canvas颜色渐变

```javascript
let grd = context.createLinearGradient(0,0,175,50);
grd.addColorStop(0, '#f00');
grd.addColorStop(0.5, '#0f0');
grd.addColorStop(1.0, '#00f');
context.fillStyle = grd;
context.fillRect(10,10, 210, 60);
```

DOM观察者

```javascript
MutationObserver
```

```
// 部分手机上支持
scrollTop + clientHeight == scrollHeight
// 以上数据可能带有小数，所以可以 x > 0
x + scrollTop + clientHeight == scrollHeight
```

```javascript
// 全局查找定义过的symbol
// 如果定义过，就返回那个symbol，
// 如果没有定义过
// 就生成

Symbol.for('name');

// 提取注册符号的描述文本
Symbol.keyFor(symbol);

// 加[] 是为了让key可以用变量
// 这种方式不会出现在枚举属性中

var obj = {
  [Symbol()]: "Hello World"
};

// 可以用 Object.getOwnPropertySymbols( obj) 方式获取

// 数组迭代其
// 字符串也可以
var arr = [1, 2, 3, 4];
for(var i of arr[Symbol.iterator]()) {
  console.log(i);
} // 1 2 3 4

// 手动生成迭代器
{
  [Symbol.iterator]() {
    return this;
  }
}

生成器函数可以调用 it.return(data)方法，直接结束

it.throw(error) 也可以

new.target 指向new实际上调用的构造器

ES6 提供的带类数组构造器
new Int8Array()
uint8Array
uint8ClampedArray 0~255 之间
Int16Array Uint16Array
Int32Array Uint32Array
Float32Array 32位浮点数
Float64Array 64位浮点数

对象只能用 字符串作为 key
Map 可以使用 对象作为key值

Set 值是唯一的

// target, startIndex, endIndex

var arr = [1, 2, 3, 4, 5];

var res = arr.copyWithin(3, 0);

console.log(res); // 1 2 3 1 2

var res = arr.find(v => {
  return v == 2;
}); // 如果有 返回原值，否则undefined

arr.findIndex(v => {
  return v == 2;
}); // 返回下标

(?:abc) \1不会匹配这个
以?开头为 非捕获组
(?=a) 后面跟a
(?!a) 后面不跟a
(?<=a) 前面是a
(?<!a) 前面不是a

(?i:a)b a不区分大小写 匹配ab Ab
(?>pattern) 侵占模式

意思时:如果匹配到了1-9之间的数字,就不会去管了
本来?是可以不匹配的,由最后的\d+去匹配
但是侵占式就直接拿到了,适用于提高效率
常用来截断
\d+\.\d\d[1-9]?+\d+ 改为 \d+\.\d\d(?>[1-9]?)\d+
```

URI scheme
data:[Mime-type][;charset=<encoding>[;base64],<data>]

浏览器显示通知API
Notification.requestPermission

webpack --profile --json > stats.json

https://alexkuz.github.io/webpack-chart/

代码大小分析

```javascript
// 根据source-map 分析
// 需要安装source-map
source-map-explorer build/*.js

// 测试打包速度
speed-measure-webpack-plugin

// 暴露模块到全局变量
expose-loader 
use: 'expose-loader?$';

// plugins 中加
new webpack.ProvidePlugin({
  $: 'jquery',
});

-! 禁用前置和正常loader
! 禁用普通loader
!! 禁用前置，后置，正常loader

pitch 有返回值直接到上一个的noraml
normal 

// canvas 多个图层处理效果
globalCompositeOperation = '';

// createjs
```

## Tribute ##

@功能实现,`tribute`


```javascript
// 获取对象的symbol属性
Object.getOwnPropertySymbols(obj);
// 获取对象的所有属性
Reflect.ownKeys(obj);

// 获取了 label 和 input 之后
// 通过属性可以获取对应的 input 和 label
label.control
input.labels

// 获取选中区域
let selection = document.getSelection();
// 获取选中区域内容
if (selection.rangeCount > 0) {
  html = "您选取了>" + selection.rangeCount + "<内容<br />";
  for (let i = 0; i < selection.rangeCount; i++) {
    let range = selection.getRangeAt(i);
    html += "第" + (i + 1) + "段内容为<br />" + range;
  }
  console.log(html);
}

// 删除选中区域
selection.deleteFromDocument();
```
## google 工具 ##

<a href="https://developers.google.cn/web">google developers web</a>

## 性能指标 ##


```
lighthouse (npm; chromeDevTools)
webPageTest

## APIS ##

* DNS 解析耗时: domainLookupEnd - domainLookupStart
* TCP 连接耗时: connectEnd - connectStart
* SSL 安全连接耗时: connectEnd - secureConnectionStart
* 网络请求耗时 (TTFB): responseStart - requestStart
* 数据传输耗时: responseEnd - responseStart
* DOM 解析耗时: domInteractive - responseEnd
* 资源加载耗时: loadEventStart - domContentLoadedEventEnd
* First Byte时间: responseStart - domainLookupStart
* 白屏时间: responseEnd - fetchStart
* 首次可交互时间: domInteractive - fetchStart
* DOM Ready 时间: domContentLoadEventEnd - fetchStart
* 页面完全加载时间: loadEventStart - fetchStart
* http 头部大小： transferSize - encodedBodySize
* 重定向次数：performance.navigation.redirectCount
* 重定向耗时: redirectEnd - redirectStart

* 告诉浏览器这个元素提取到单独的图层里
```css
will-change: transform;
```

## 导出表格图片 ##

html > table 转base64,然后就是正常下载流程

```javascript
/* eslint-disable */
let idTmr;
const getExplorer = () => {
	let explorer = window.navigator.userAgent;
	//ie
	if (explorer.indexOf("MSIE") >= 0) {
		return 'ie';
	}
	//firefox

	else if (explorer.indexOf("Firefox") >= 0) {
		return 'Firefox';
	}
	//Chrome
	else if (explorer.indexOf("Chrome") >= 0) {
		return 'Chrome';
	}
	//Opera
	else if (explorer.indexOf("Opera") >= 0) {
		return 'Opera';
	}
	//Safari
	else if (explorer.indexOf("Safari") >= 0) {
		return 'Safari';
	}
}
// 判断浏览器是否为IE
const exportToExcel = (data, name) => {

	// 判断是否为IE
	if (getExplorer() == 'ie') {
		tableToIE(data, name)
	} else {
		tableToNotIE(data, name)
	}
}

const Cleanup = () => {
	window.clearInterval(idTmr);
}

// ie浏览器下执行
const tableToIE = (data, name) => {
	let curTbl = data;
	let oXL = new ActiveXObject("Excel.Application");

	//创建AX对象excel
	let oWB = oXL.Workbooks.Add();
	//获取workbook对象
	let xlsheet = oWB.Worksheets(1);
	//激活当前sheet
	let sel = document.body.createTextRange();
	sel.moveToElementText(curTbl);
	//把表格中的内容移到TextRange中
	sel.select;
	//全选TextRange中内容
	sel.execCommand("Copy");
	//复制TextRange中内容
	xlsheet.Paste();
	//粘贴到活动的EXCEL中

	oXL.Visible = true;
	//设置excel可见属性

	try {
		let fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
	} catch (e) {
		print("Nested catch caught " + e);
	} finally {
		oWB.SaveAs(fname);

		oWB.Close(savechanges = false);
		//xls.visible = false;
		oXL.Quit();
		oXL = null;
		// 结束excel进程，退出完成
		window.setInterval("Cleanup();", 1);
		idTmr = window.setInterval("Cleanup();", 1);
	}
}

// 非ie浏览器下执行
const tableToNotIE = (function () {
	// 编码要用utf-8不然默认gbk会出现中文乱码
	const uri = 'data:application/vnd.ms-excel;base64,',
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

	const base64 = function (s) {
		return window.btoa(unescape(encodeURIComponent(s)));
	}

	const format = (s, c) => {
		return s.replace(/{(\w+)}/g,
			(m, p) => {
				return c[p];
			})
	}

	return (table, name) => {
		const ctx = {
			worksheet: name,
			table
		}

		const url = uri + base64(format(template, ctx));

		if (navigator.userAgent.indexOf("Firefox") > -1){
			window.location.href = url
		} else {
			const aLink = document.createElement('a');
			aLink.href = url;
			aLink.download = name || '';
			let event;
			if (window.MouseEvent) {
				event = new MouseEvent('click');
			} else {
				event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			}
			aLink.dispatchEvent(event);
		}
	}
})()

// 导出函数
const table2excel = (column, data, excelName) => {
	const typeMap = {
		image: getImageHtml,
		text: getTextHtml
	}

	let thead = column.reduce((result, item) => {
		result += `<th>${item.title}</th>`
		return result
	}, '')

	thead = `<thead><tr>${thead}</tr></thead>`

	let tbody = data.reduce((result, row) => {
		const temp = column.reduce((tds, col) => {
			tds += typeMap[col.type || 'text'](row[col.key], col)
			return tds
		}, '')
		result += `<tr>${temp}</tr>`
		return result
	}, '')

	tbody = `<tbody>${tbody}</tbody>`

	const table = thead + tbody

	// 导出表格
	exportToExcel(table, excelName)

	function getTextHtml(val) {
		return `<td style="text-align: center">${val}</td>`
	}

	function getImageHtml(val, options) {
		options = Object.assign({width: 40, height: 60}, options)
		return `<td style="width: ${options.width}px; height: ${options.height}px; text-align: center; vertical-align: middle"><img src="${val}" width=${options.width} height=${options.height}></td>`
	}
}

export default table2excel

```
图片压缩 `https://github.com/fengyuanchen/compressorjs`
```

```
gsap 动画库
https://greensock.com/3-release-notes
pixi.js 、three.js

```

```javascript
function myNew(fn, ...args) {
  const obj = {};
  obj.__proto__ = fn.prototype;
  fn.apply(fn, args);
  return obj;
};

```

## sonar qube 

> 代码质量管理

## 微前端框架

> `single-spa`

## 代码调试

1. chrome 导入项目文件  

`Chrome DevTools > Sources > FileSystem > Add folder to workspace`

2. chrome 会自动检测是否和当前网站的代码一致，如果是一致的，修改workspace中的文件会直接看到变化

## 异常堆栈中忽略某个文件中的所有堆栈

右键 `Add script to ignore list`

## shadow dom 

> 可以实现样式隔离

```javascript
const el = document.querySelector('selector');
const shadow = el.attachShadow({ mode: 'open' });

// innerHTML 中包含style或者link 引入样式
shadow.innerHTML = `innerHTML`;
```

## lit、carbon

`web component` 函数库
