const webpack = require('webpack');
const path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // no support for ES6+
const TerserPlugin = require('terser-webpack-plugin'); // support for ES6+ (succesor of uglify-es)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	node: false,
	node: {
		fs: 'empty'
	},
	mode: 'production',
	// devtool:
	// devServer: {
	// 	//contentBase: path.join(__dirname, 'demo'),
	// 	//compress: true,
	// 	port: 8889,
	// 	writeToDisk: false,
	// },
	performance: {
		hints: false,
	},
	target: 'web',
	context: path.resolve(__dirname, 'src'),
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				cache: false,
				//test: /\.js(\?.*)?$/i,
				test: /\.min\.js$/
			}),
		],
	},

	entry: {
		//'ractive-window': path.resolve(__dirname, './src/index.js'),
		'ractive-window.min': path.resolve(__dirname, './src/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'RactiveWindow',

		// var, this, window, umd , amd, commonjs, global
		libraryTarget: 'umd',
		umdNamedDefine: true,   // Important
		libraryExport: 'default',
		globalObject: 'this',
	},
	externals: {
		ractive: {
			commonjs: 'ractive',  // require
			commonjs2: 'ractive', // require + module.exports - used by nodejs
			amd: 'ractive',
			root: 'Ractive'
		},
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: "[name].css" }), // { filename: "[name].[contentHash].css" }
		new CopyPlugin([
			{ from: 'css/theme.less', to: 'less/theme.less' },
			{ from: 'css/common.less', to: 'less/common.less' },
			{ from: 'css/theme-windows.less', to: 'less/theme-windows.less' },
			{ from: 'css/theme-atom.less', to: 'less/theme-atom.less' },
		]),
	],
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader, // extract css into files
					{
						loader: 'css-loader', // translates CSS into CommonJS
					},
					{
						loader: 'less-loader', // compiles Less to CSS
						// options: {
						//	paths: [path.resolve(__dirname, 'node_modules')],
						// 	strictMath: true,
						// 	noIeCompat: true,
						// },
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: 'babel-loader'
			}
		]
	}
}
