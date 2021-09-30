const os = require('os');
const net = require('net');

const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const networkInterfaces = os.networkInterfaces();
let host = '127.0.0.1';
const port = 8002;

for (let network in networkInterfaces) {
  networkInterfaces[network].forEach(config => {
    let address = config.address;
    if (!config.internal && net.isIPv4(address)) {
      host = address;
    }
  });
}
module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		publicPath: `http://${host}:${port}/`,
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new ModuleFederationPlugin({
			name: "app2",
			filename: "app2.js",
			remotes: {
        // app1里面的 ModuleFederationPlugin option
        // {name}@{output.publicPath}{filename}
				app1: `app1@http://${host}:8001/app1.js`,
			},
		}),
	],
	devServer: {
		host,
		port,
	},
};
