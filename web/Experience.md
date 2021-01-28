6. PureComponent做浅比较，如果数据没变不会重新渲染

19. React.memo(functionComponent) 缓存函数组件(组件只和传入的参数有关)

20. useCallback useReducer useContext

23. let [state, dispatch] = useReducer(reducer: function, initialValue);

24. vue keep-alive 中的include exclude 中的name是组件上的name属性，不是router上的name属性

29. addEventListener(eventName, obj.method) 中method的this指向obj

30. Vue事件修饰符会将除第一个参数以外的参数丢失

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

70. react-transition-group 动画插件

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


