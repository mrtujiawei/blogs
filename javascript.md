
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

## 函数参数传递的步骤 ##

1. 创建对象；

2. 找形参和变量声明，
将变量和形参名作为AO属性名，
值为undefined

3. 将实参值和形参值统一

4. 在函数体里找函数声明，值赋予函数体

## 对象操作 ##

1. 冻结

```javascript
Object.freeze(obj);
```

2. 密封

```javascript
Object.seal(obj);
```

3. 扩展

```javascript
Object.preventExtensions(obj);
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

## prototype

原型是function 对象的一个属性，

它定义了构造函数制造出的对象的共有祖先

通过该构造函数产生的对象

可以继承该原型的属性和方法

原型也是对象

document的原型

document --> HTMLDocument.prototype -->Document.prototype

```javascript
// 全局查找定义过的symbol
// 如果定义过，就返回那个symbol，
// 如果没有定义过
// 就生成

Symbol.for( 'name');

// 提取注册符号的描述文本
Symbol.keyFor( symbol );

// 加[] 是为了让key可以用变量
// 这种方式不会出现在枚举属性中

var obj = {
	[ Symbol() ]: "Hello World"
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

## Vue Router ##

```javascript
activated
deactivated
```
```javascript
this.$router.go(-1); // 返回上一个页面
this.$router.replace('/menu'); // 跳转到指定的路由
this.$router.replace({
    name : 'menulink'
}); // 通过name属性跳转到指定路由
this.$router.push('/about'); // 跳转到about, 最常用
```

## 导航守卫

### 全局守卫

```javascript
router.beforeEach((to, from, next) => {
  // alert('还没有登录,请先登录');
  // next();  //显示要去的页面
  // console.log(to.path);
  if(to.path == '/login' || to.path == '/regist') {
    next();
  } else {
    alert('还没有登录,请先登录');
    next('login');
  }
});
```
### 后置钩子

```javascript
// 进入之后会触发这个
router.afterEach((to, from) => {
  console.log('jinrule');
});
```

### 路由独享守卫

```javascript
// 写在特定的路由中, 只针对特定的路由
// next(false) 不会正常跳转
{
  path : '/admin',
  component : Admin,
  beforeEnter : (to, from, next) => {
    console.log(1);
    next();
  }
}
```

### 组件内守卫

```javascript
beforeRouteEnter : (to, from, next) => {
  // 组件未渲染前  不能拿到对应的数据
  // console.log("Hello " + this.name);
  next(vm => {
    console.log(vm.name);
  });
}
// 离开组件之前
beforeRouteLeave : (to, from, next) => {
  if(confirm("确定离开吗?")) {
    next();
  }
}
```

### router-view 复用

```javascript

{
  name : 'homelink',
  path : '/',
  // 在'/'中显示多个router-view
  // 其中orderingGuider, delivery
  // history 为有name属性且和上述对应
  // 的router-view
  // default 为默认的没有name属性的路由
  components : {
    default : Home,
    orderingGuide : OrderingGuide,
    delivery : Delivery,
    history : History
  }
},
```

### 控制滚动行为

进入页面之后直接滚动到指定位置

```javascript
// 在new VueRouter中可以使用
scrollBehavior(to, from, savedPosition) {
  return {
    x: 0,
    y: 550
  };
  // 第一个有.btn类的在最上面
  return {
    selector: '.btn'
  };
  // 浏览器按回退时起作用
  if(savedPosition) {
    return savedPosition;
  } else {
    return {
      x : 0,
      y : 0
    };
  }
}
```

## 获取路由参数

> 首先在路由中设置对应的参数

```json
{
    path: '/blog/:id',
}
```

> 跳转链接中 to="/blog/2"
> 可以在对应的组件中使用 this.$route.params.id 获取参数值 2

### 通过路由传递参数
> 在跳转时 使用 this.$router.push()
> push中需要穿一个对象

```javascript
{
    path: '/test',
    query: {
        message: '这是传递的消息'
    }
}
```

> 跳转后的页面接受参数

```javascript
// 需要注意的时 this.$route
this.$route.query.message
```

# vuex store 使用
> 准备 npm install vuex 安装vuex模块
> 新建store 文件 用来保存全局的数据
> 全局注册组件  Vue.use(Vuex)
> 实例化vuex对象  new Vuex.store()
> new Vuex.store()时可以传的键值

## state  用来保存数据

## getters 用来获取数据，不会修改原来的数据

>   也不能真的修改， getters里面修改会报错
>   不过也可返回修改后的数据
>   使用: this.$store.getters.方法名
>   getters 中的方法有两个参数，一个为state， 一个为 getters（整个getters对象）

## mutations 需要改变值，并触发事件 需要使用 commit方法

>   store.commit('事件名字', {参数})
>   或者

```javascript
// payload 会接受所有的参数，包括type
store.commit({
    type: '事件名字',
    params: params
});
```
>   mutations 的方法有两个参数， 一个为state， 一个为payload
>   接受的参数放在 payload 中

## action 实现异步操作 提交mutation 而不是直 接变更状态

>   触发方式 store.dispatch  分发action
>   传递参数  store.dispatch('方法', {参数})
>   参数只有一个  payload 可以是任意类型
>   在action 方法内部去同步或异步commit mutations中的方法
> - map
> 需要的参数为一个对象， 用来保存数据，没有要求
> export store
> 使用 computed 属性
> this.$store.属性
> - mapGetters ：
>   当要触发的getters 中的方法比较多时，
>   可以使用这个方式
>   需要 babel-preset-stage-2 --save-dev
>   mapGetters 为es6的方法

```javascript
import { mapGetters } from 'vuex'
...mapGetters([
    "func1",
    "func2"
])
```
> - mapActions 与 上述类似

## plugins 接受一个数组，里面放各种插件（函数)

> 函数接受一个store参数，在store初始化的时候会调用这些函数
> 可以执行一些复杂或异步操作

```javascript
// 会在每次触发mutation后调用函数内部的store.subscribe中的方法
// mutation 为 payload 参数
store.subscribe((mutation, state) => {
    // TODO
})
```

## modules

> 放 module 对象， 该对象中可以放上面所有的属性，
> 相当于进一步的封装
> dispatch 时 只需 对应的方法名就可以
> 如果 有 ```namespaced: true```则需要使用```moduleName/methodName```
> 在模块中注册全局action

```javascript
methodName: {
    root: true,
    handler (namespacedContext, payload) {
        ...
    }
}
```

```javascript
// 通过name0/name1访问
// 也可以只有一个'name'
store.registerModule(['name1', 'name'1], {
    ...
}
```

## 自定义指令 ##

```javascript
// 可以在局部用directives 注册指令
Vue.directive('color', {
  // el 调用这个指令的标签
  // binding 传递的信息
  // 如 v-for 后面的 item in items
  // 传递参数为字符串时需要有引号 *特别
  // binding.arg 传递的参数 :col 需要加:
  // 如 v-color:test="'col'"
  bind(el, binding, vnode) {
    el.style.color = '#f0f';
  }
})
```

## 监听子组件的声明周期 ##

```javascript
@hook:mounted="listener"
```

## 滚动穿透 ##

- 内层滚动带动外层

```css
body.modal-open {
    position: fixed;
}
```

```javascript
var ModalHelper = (function (bodyCls) {
    var scrollTop;
    return {
        afterOpen: function () {
            scrollTop = document.documentElement.scrollTop ||  document.body.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px';
        },
        beforeClose: function () {
            console.log(20);
            document.body.classList.remove(bodyCls);
            document.scrollingElement.scrollTop = scrollTop;
        }
    };
})('modal-open');

/***进入遮罩层，禁止滑动***/
function stopScroll() {
    ModalHelper.afterOpen();
}

/***取消滑动限制***/
function allowScroll() {
    ModalHelper.beforeClose()
}
```

```javascript
// 计算滚动高度
let scrollTop = document.documentElement.scrollTop ||  document.body.scrollTop;
```

```javascript
判断是否是IE8以下版本
if(!+"\v1") {
    console.log('< IE8');
} else {
    console.log('>= IE8');
}
```

## 移动端全面禁止默认事件 ## 

```javascript
// 在需要的地方 ev.stopPropagation();
document.addEventListener('touchstart', ev => {
    ev = ev || event;
    ev.preventDefault();
}, {
	passive: false,
});
```

## js 奇怪的地方 ## 

```javascript
-Infinity + Infinity // NaN
Infinity + n // NaN
Infinity * 0 // NaN
Infinity / Infinity // NaN
Infinity % n // NaN
Infinity % Infinity // NaN
NaN && 'NaN' // NaN
'NaN' && NaN // NaN
'null' && null // null
null && 'null' // null
undefined && 'undefined' // undefined
'undefined' && undefined // undefined
let obj1 = {
    name: 'tujiawei',
};
let obj2 = {
    name: '123',
};
console.log(obj1 >= obj2); // true
console.log(obj1 <= obj2); // true
NaN == NaN // true
null == undefined // true
```

## 适配方案 ## 

```javascript
/**
 * rem适配
 * 需要在页面上先写好
 * @author 屠佳伟 Mrprince 2019-12-29
 * @param  {[number]} num 宽度为多少rem. (默认为10)
 */
function remAdaptation(num = 10) {
    addEventListener('DOMContentLoaded', function () {
        var styleNode = document.createElement('style');
        styleNode.innerHTML = 'html{font-size: ' + (document.documentElement.clientWidth / num) + 'px !important;}';
        document.head.appendChild(styleNode);
    });
}

/**
 * viewport 适配
 * 需要提前在页面上写好
 * <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
 * 因为innerWidth等兼容性太差
 * 用viewport 适配后,1px 就是1物理像素
 * @author 屠佳伟 Mrprince 2019-12-29
 * @param  {[type]} targetWidth 设计图的宽度
 */
function viewportAdaptation(targetWidth) {
    let target = 750;
    let viewport = document.querySelector('meta[name=viewport]');
    let scale = document.documentElement.clientWidth / target;
    viewport.content = `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`;
}
/**
 * 1物理像素实现
 * rem 与原来相同
 * 1px 就是1物理像素
 * 保留完美视口
 * @author 屠佳伟 Mrprince 2019-12-29
 */
function remAndViewportAdaptation(num) {
    addEventListener('DOMContentLoaded', function () {
        let dpr = window.devicePixelRatio || 1;
        var styleNode = document.createElement('style');
        styleNode.innerHTML = 'html{font-size: ' + (document.documentElement.clientWidth * dpr / num) + 'px !important;}';
        document.head.appendChild(styleNode);
        let meta = document.querySelector('meta[name=viewport');
        meta.content = `width=device-width, initial-scale=${1 / dpr}, maximum-scale=${1 / dpr}, minimum-scale=${1 / dpr}, user-scalable=no`;
    });
}
```

## SSE ##

```javascript
var http = require("http");

http.createServer(function (req, res) {

    var fileName = "." + req.url;

    if (fileName === "./stream") {
        res.writeHead(200, {"Content-Type":"text/event-stream",
                            "Cache-Control":"no-cache",
                            "Connection":"keep-alive",
                            "Access-Control-Allow-Origin": '*'});
        // 重连事件
        res.write("retry: 10000\n");
        // 触发事件
        res.write("event: connecttime\n");
        // 发送数据
        res.write("data: " + (new Date()) + "\n\n");
        res.write("data: " + (new Date()) + "\n\n");
        res.write('id:msg1\n');
        let count = 0;
        interval = setInterval(function() {
            // 发送ID
            // 相当于保存个茆点
            // 出错了从这里开始恢复
            res.write('id:msg' + count + '\n');
            res.write("data: " + (new Date()) + '---' + count + '---' + "\n\n");
            count ++;
        }, 1000);

        req.connection.addListener("close", function () {
            clearInterval(interval);
        }, false);
  }
}).listen(4444);
```

## Vue更新文件后刷新页面(线上) ##

```javascript
router.onError(error => {
  const pattern = /Loading chunk/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    window.history.replaceState({}, document.title, targetPath);
    window.location.reload();
  }
});
```

## Vue 路径别名 ##

```javascript
const resolve = dir => path.join( __dirname, dir );
chainWebpack: config => {
    config.resolve.alias
      .set( '@', resolve( 'src' ) );
}
```

## Vue 删除console ##

npm install -D uglifyjs-webpack-plugin@1.1.1

```javascript
configureWebpack: config => {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      //生产环境自动删除console
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
          },
        },
        sourceMap: false,
        parallel: true,
      })
    );
  }
}

```

## Vue gzip 压缩 ##

```javascript
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// configureWebpack.plugins

new CompressionWebpackPlugin({
	filename: '[path].gz[query]',
	algorithm: 'gzip',
	test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'), // 匹配文件名
	threshold: 102, // 对0.1K以上的数据进行压缩
	minRatio: 0.8,
	deleteOriginalAssets: false /* process.env.NODE_ENV == 'production' // 是否删除源文件 */
});
```

## Vue plugin cdn ##

```javascript
// 打包cdn优化
const WebpackCdnPlugin = require('webpack-cdn-plugin');
configureWebpack.plugins
new WebpackCdnPlugin({
  modules: [{
    name: 'vue',
    var: 'Vue',
    path: 'vue.runtime.min.js',
    // 单独配置
    // 会覆盖整体配置
    prodUrl: '//a.xingqiu.tv/xqbl/:path'
  }]
  publicPath: '/node_modules',
  // 整体配置
  prodUrl: '//res.appbocai.com/xqbl/:path'
});
```