# javascript #

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

```javascript
// 兼容性处理
// 下一次重绘前调用
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60)
        }
}());
```

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
DOMParser  =>  parseFromString 装字符串为dom文档
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

4. 配置对象属性

```javascript
Object.defineProperty(obj, "name", {
    value : "tujiawei",
    writable : false,
    configurable : true,
    enumerable : false,
});
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

```javascript
/**
 * 希尔排序
 */
function shellSort(arr, compareTo = (a, b) => a - b) {
  let n = arr.length;
  let h = 1;
  while(h < n / 3) {
    h = 3 * h + 1;
  }

  while(h >= 1) {
    for(let i = h; i < n; i++) {
      for(let j = i; j >= h && compareTo(arr[j], arr[j - h]) < 0; j -= h) {
        [arr[j], arr[j - h]] = [arr[j - h], arr[j]];
      }
    }
    h = parseInt(h / 3);
  }
}
```