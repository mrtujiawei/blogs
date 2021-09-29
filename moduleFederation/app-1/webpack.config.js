const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // 最后的'/'非常重要，不然可能找不到文件
    publicPath: 'http://localhost:8001/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'app1.js',
      exposes: {
        './app1': './src/index.js',
      },
    }),
  ],
  devServer: {
    host: 'localhost',
    port: 8001,
  },
};
