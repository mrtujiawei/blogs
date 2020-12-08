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