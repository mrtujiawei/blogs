const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		publicPath: "http://localhost:8002/",
	},
	devServer: {
		host: "localhost",
		port: 8002,
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new ModuleFederationPlugin({
			name: "app2",
			filename: "app2.js",
			remotes: {
        // app1里面的 ModuleFederationPlugin option
        // {name}@{output.publicPath}{filename}
				app1: "app1@http://localhost:8001/app1.js",
			},
		}),
	],
};
