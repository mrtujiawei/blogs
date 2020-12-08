1. 把接口请求单独放到一个js文件中，这样做的好处是，如果有多个地方用到了这个接口，只要引入一下，传请求参数就可以，不需要每次都重写一遍，比如说列表和导出

2. 对于react中的组件，最好就是view层用 jsx，并且把样式文件和jsx文件放在一起，当不需要这个组件的时候直接删掉整个文件夹就好了

3. 对于循环中的key 可以的话，尽量不要用index，一般数据中肯定有一个是主键，这样渲染的时候不会出问题

4. 一般只有后台会嵌套很多层路由，因为后台要尽可能多的展示数据，而用户界面是尽量少的展示

5. react能写成函数组件就写成函数组件，虽然提升的效率可以忽略不计，但总比没有好      

6. PureComponent做浅比较，如果数据没变不会重新渲染

7. react中的css文件是全局的，所以要自己来控制css的作用域，这好像有点难，不过可以用css module来处理，以后试试看，现在页面很少，但是也出现了很多的样式冲突

8. public 中的文件不会进行打包，直接复制过去

9. redux 单独写个type.js文件比较好

10. webpack打包支持多页，需要在webpack.config.js中写page属性

14. rxjs我感觉好像用不上，因为我发现他好像只是把一系列请求预先排序然后请求，和async await 没有什么区别，还很大程度上改变了我的代码风格，可能是我使用的不够深吧

16. 
```javascript
React.children.map(props.children, (element, index) => {
        console.log(element.props);
        return { element }
    });
```
17. redux 中 dispatch type 会触发所有相同的type，所以type必须不同，因此最好严格遵守第9条

18. HashRouter 中直接用window.localtion.back(-1)也能切换视图

19. React.memo(functionComponent) 缓存函数组件(组件只和传入的参数有关)

20. useState useEffect useCallback useReducer useContext

21. useEffect(fn, [val]) 只有val变的时候才会update fn返回值为释放资源的回调

22. useCallback(fn, [val]) 同上

23. let [state, dispatch] = useReducer(reducer: function, initialValue);

24. vue keep-alive 中的include exclude 中的name是组件上的name属性，不是router上的name属性

25. 尽量不要直接使用undefined 因为可以认为改变，建议void 0

26. typescript const enum 编译后会直接没有，减少代码量

29. addEventListener(eventName, obj.method) 中method的this指向obj

30. Vue事件修饰符会将除第一个参数以外的参数丢失

31. typescript keyof obj 可以获取对象的全部key作为类型

32. webpack ts-loader option transpileOnly 加快编译速度

33. tsconfig.json extends 可以继承已有的配置 

34. references {path: 'path'} 可以选择其他需要编译的文件

35. compilerOptions: { "outFile": 'path', type: ["node"]}

36. rootDirs 虚拟的把多个目录放在同一个目录下，可以直接./引入

37. webpack 打包 优化 拆包  {optimization: splitChunk: {chunks: 'all'}} 把node_modeles 下面的文件抽取出来打包成vendor文件

38. MiniCssExtractPlugin 提取css文件为单独的文件 loader 为MiniCssExtractPlugin.loader

39. postcss-loader  postcss-preset-env 需要在package.json里面配置browserList 

40. 压缩css插件 optimize-css-assets-webpack-plugin

41. eslint 插件配置 airbnb  --> eslint-config-airbnb-base eslint-plugin-import 

42. eslintConfig{extends: "airbnb-base"}

43. js兼容性处理 babel-loader options: {presets: ['@babel/preset-env'], exclude: /node_modules/}  (babel-core babel-loader @babel/preset-env, @babel-polyfill)

44. import '@babel-polyfill' 就能使用，但是全部引入了，很多东西用不到

45. @babel-polyfill 按需加载 corejs (npm i core-js -D)  不需要引入 import '@babel/polyfill';
    babel-loader options: {
        presets: [
            ['@babel/preset-env'],
            {
                // 使用了才打包进去
                useBuiltIns: 'usage',
                // 指定corejs版本
                corejs: {
                    version: 3'
                },
                target: {
                    // 做到60版本
                    chrome: '60'
                }
            }
        ], 
        exclude: /node_modules/
    }

46. HtmlWebpackPlugin({
        template: 'filepath',
        // 移除空格和注释
        minify: {
            removeComments: true,
            collapseWhiteSpace: true
        }
    })

47. enforce: 'pre' 优先执行这个loader 'post' 延后执行 不写中间执行

48. HMR hot module replacement 模块热替换 只会重新打包变化的模块，而不是打包所有，提升构建速度 devServer: {hot: true}

49. HMR 不能监视html文件，需要在entry中用输入加上html文件路径

50. devtool: 'source-map' webpack的第六个模块？

51. [inline-|hidden-|eval-][nosouces-][cheap-[module-]]source-map

52. module: {rules: {oneOf: [(这里的loader只会执行一个)]}}

53. cashDirectory: true 开启babel缓存

54. [chunkhash:8] 代替 [hash:8] 让失效的资源少一点

55. [contenthash:8] 更好， 单独管理 和内容有关，内容不变 就不会打包

56.  tree shaking [es6 production]

57. sideEffects: false (package.json) 可能会把css文件干掉

58. sideEffects: ["*.css", "*.less"] 去掉某些文件

59. thread-loader 一般给babel-loader用 use: ['thread-loader', {loader: '...'}] 开进程可能需要很长时间

60. externals 不会被打包进bundles.js
```javascript
// 不再需要CdnWebpackPlugin了
module.exports = {
    externals: {
        // 库名: 包名
        jquery: 'jQuery'
    }
}
```

61. 多入口  entry 中写对象

62. 
```javascript
// 分离库和自己写的代码
optimization: {
    splitChunks: {
        chunks: 'all'
    }
}
```
63. dll 
```javascript
// webpack.dll.js
entry: {
    jquery: ['jquery']
},
output: {
    // 向外暴露出去的名字
    library: '[name].[hash]' 
},
plugins: [
    // 打包生成一个manifest.json文件
    new webpack.DllPlugin({name: [name].[hash], path: 'dll/manifest.json'})
]

// webpack.config.js
// 使用时需要
plugins: [
    new webpack.dllReferencePlugin({
        // 不参与打包的名字和需要改名称的库
        manifest: resolve(__dirname, 'dll/manifest.json')
    })
]
```

64. add-asset-html-webpack-plugin  将某个文件打包输出出去，并在html中自动引入该文件

```javascript
// 将dll 中的文件自动引入html
new AddAssetHtmlWebpackPlugin({
    filepath: resolve(__dirname, 'dll/jquery.js')
})
```

65. 解析模块的规则

```javascript
{
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }, 
        extensions: ['.js', '.json', '.css'],
        // 去哪个目录找
        modules: ['node_modules']
    }
}
```

66. 不要全屏报错 overlay: false

67. TerserWebpackPlugin 代码压缩插件 uglify 已经不再维护 (minimizer 里面加 [new TerserWebpackPlugin])

68. React: 尽量使用无状态组件，这样渲染效率比较高，因为不需要触发生命周期函数

69. React: 组件也是数据

