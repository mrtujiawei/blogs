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