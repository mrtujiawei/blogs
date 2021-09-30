const os = require('os');
const net = require('net');
const { ModuleFederationPlugin } = require('webpack').container;

const networkInterfaces = os.networkInterfaces();

let host = '127.0.0.1';
const port = 8001;

for (let network in networkInterfaces) {
  networkInterfaces[network].forEach(config => {
    let address = config.address;
    if (!config.internal && net.isIPv4(address)) {
      host = address;
    }
  });
}

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // 最后的'/'非常重要，不然可能找不到文件
    publicPath: `http://${host}:${port}/`,
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
    host,
    port,
  },
};
