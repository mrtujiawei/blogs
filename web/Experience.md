# 设计模式

## 单一职责原则

一个方法，一个类 只做一件事情
提高代码重用性，便于功能组织

## 里式替换原则

问题：在软件系统中，一个可以引用父类的地方，一定能够透明的使用子类
问题解决：依赖倒置原则

## 依赖倒置原则

不依赖与具体的实现，而依赖于抽象
目的：降低代码的耦合度

## 开闭原则

对扩展开发，对修改关闭
说明：类似继承，不修改基类，而去修改扩展的子类
解决问题：降低代码冗余

## 接口隔离原则

尽量使用小的接口，去隔离大的接口

## 聚合/组合/合成复用原则

如果类与类之间存在关系，尽量使用聚合关系
而减少对继承关系的使用

## 迪米特法则

最少知道原则

6. PureComponent做浅比较，如果数据没变不会重新渲染

19. React.memo(functionComponent) 缓存函数组件(组件只和传入的参数有关)

24. vue keep-alive 中的include exclude 中的name是组件上的name属性，不是router上的name属性

29. addEventListener(eventName, obj.method) 中method的this指向obj

30. Vue事件修饰符会将除第一个参数以外的参数丢失

37. webpack 打包 优化 拆包  {optimization: splitChunk: {chunks: 'all'}} 把node_modeles 下面的文件抽取出来打包成vendor文件

39. postcss-loader  postcss-preset-env 需要在package.json里面配置browserList 

41. eslint 插件配置 airbnb  --> eslint-config-airbnb-base eslint-plugin-import 

42. eslintConfig{extends: "airbnb-base"}

47. enforce: 'pre' 优先执行这个loader 'post' 延后执行 不写中间执行

48. HMR hot module replacement 模块热替换 只会重新打包变化的模块，而不是打包所有，提升构建速度 devServer: {hot: true}

49. HMR 不能监视html文件，需要在entry中用输入加上html文件路径

52. module: {rules: {oneOf: [(这里的loader只会执行一个)]}}

54. [chunkhash:8] 代替 [hash:8] 让失效的资源少一点

55. [contenthash:8] 更好， 单独管理 和内容有关，内容不变 就不会打包

57. sideEffects: false (package.json) 可能会把css文件干掉

58. sideEffects: ["*.css", "*.less"] 去掉某些文件

62. 
```javascript
// 分离库和自己写的代码
optimization: {
    splitChunks: {
        chunks: 'all'
    }
}
```

64. add-asset-html-webpack-plugin  将某个文件打包输出出去，并在html中自动引入该文件

```javascript
// 将dll 中的文件自动引入html
new AddAssetHtmlWebpackPlugin({
    filepath: resolve(__dirname, 'dll/jquery.js')
})
```

66. 不要全屏报错 overlay: false

68. React: 尽量使用无状态组件，这样渲染效率比较高，因为不需要触发生命周期函数

71. 表格

表格响应式，有空的时候可以做一下

|序号| 名称 | 操作|
|:--:|:----:|:---:|
| 1  | abc  | add |
| 2  | abc  | add |
| 3  | abc  | add |
| 4  | abc  | add |


┌─────────┬────────────┐
│  序号   │     1 add  │
├─────────┼────────────┤
│  名称   │    abc     │
└─────────┴────────────┘


72. hooks

```javascript
let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memorizedState: null,
};

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      memorizedState: initialState,
      next: null,
      queue: {
        pending: null,
      },
    };
    if (!fiber.memorizedState) {
      fiber.memorizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memorizedState;

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate != hook.queue.pending.next);

    hook.queue.pending = null;
  }

  hook.memorizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null,
  };

  if (queue.pending == null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  schedule();
}

function schedule() {
  workInProgressHook = fiber.memorizedState;
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

function App() {
  const [num, setNum] = useState(0);

  console.log('isMount?', isMount);
  console.log('num:', num);

  return {
    onClick() {
      setNum(num => num + 1);
    },
  };
}

let app = schedule();
app.onClick();
```
