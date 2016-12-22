const path = require('path');
const process = require('process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const config = {
	entry: {
		'vendor': [
				 'imports?exports=>false&module=>false!jquery',
				 'foundation',
				 'imports?exports=>false&module=>false!webcom',
				 'font-awesome',	 
				 'imports?this=>window!jq-mobile',
				 'jq-confirm',
				 'jq-mobile-css',
				 'jq-confirm-css',
				 'jquery-ui',
				 'jq-qrcode',
				 'touch-punch',
				 'mobile-detect'	 
		],
		'app': [
			'file?name=manifest.json!./manifest.json',
			'./src/script.js']
	},
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, './dist/'),
		publicPath: process.env.PUBLIC_PATH || '/'
	},
	resolve: {
    	root: __dirname,
        alias: {
        	'jquery': 'jquery/dist/jquery.min.js',
        	'jquery-ui' : 'jquery-ui-bundle/jquery-ui.min.js',
        	'touch-punch' : 'jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
    		'foundation' : 'foundation-sites/dist/foundation.min.js',
			'jq-mobile' : 'jquery-mobile/dist/jquery.mobile.min.js',
			'jq-mobile-css' : 'jquery-mobile/dist/jquery.mobile.min.css',
			'jq-confirm' : 'jquery-confirm/dist/jquery-confirm.min.js',
			'jq-confirm-css' : 'jquery-confirm/dist/jquery-confirm.min.css',
			'jq-qrcode' : 'jquery.qrcode/jquery.qrcode.min.js',
			'font-awesome': 'font-awesome/css/font-awesome.min.css',
			'mobile-detect': 'mobile-detect/mobile-detect.min.js',
			'webcom': 'webcom/webcom.js'
        },
        extensions: ["", ".webpack.js", ".web.js", ".js", ".css", ".min.css", ".scss"],
        modulesDirectories: ["node_modules", "assets"]
    },
	module: {
		loaders: [
			{ test: /\.(jpe?g|png)$/, loader: 'url?name=assets/images/[name].[ext]', exclude: '/node_modules/'},
			//{ test: /\.png|jpg$/, loader: 'file?name=assets/images/[name].[ext]', exclude: '/node_modules/'},
			{ test: /\.scss$/, loaders: ["style", "css", "sass"] },
			{ test: /\.(eot|gif|woff|woff2|ttf|svg|ico)(\?\S*)?$/, loader: 'url?limit=100000&name=assets/[name].[ext]'}	
		],
		noParse: [	
		    /jquery.*\.min\.js$/,
			/webcom\.js$/
		]
	},
	sassLoader: {
    	includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss"),
    				   path.resolve(__dirname, "node_modules/motion-ui")]
  	},
	plugins: [
		new HtmlWebpackPlugin(
			{
				template: './src/index.html',
				inject: 'body',
				favicon: './assets/images/icons/webcom_logo.ico'
			}
		),
		new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity }),
		new CopyWebpackPlugin([{ from: 'assets/images/icons', to: 'assets/images' },
							   { from: 'assets/images/bricks', to: 'assets/images'}]),
		new webpack.DefinePlugin({
			__WEBCOM_SERVER__: JSON.stringify(process.env.WS_SERVER || 'https://webcom.orange.com'),
			__NAMESPACE__: JSON.stringify(process.env.NAMESPACE || 'legorange')
		}),
	],
	progress: true,
	target: 'web'
};

if (process.env.NODE_ENV !== 'production') {
	config.entry.vendor = config.entry.vendor.concat([
		'./hotReload',
		'webpack/hot/dev-server'
	]);
	config.module.loaders = config.module.loaders.concat([
		{ test: /\.less$/, loader: 'style-loader!css-loader?sourceMap!less-loader?sourceMap'},
		{ test: /\.css$/,  loader: 'style-loader!css-loader?sourceMap' }
	]);
	config.devtool = 'eval-cheap-module-source-map';
	config.debug = true;
} else {
	config.plugins = config.plugins.concat([
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new ExtractTextPlugin('[name].css')
	]);
	config.module.loaders = config.module.loaders.concat([
		{ test: /\.less/, loader: ExtractTextPlugin.extract(
			'style',
			'css-loader?sourceMap&minimize!less-loader?sourceMap'
		)},
		{ test: /\.css/, loader: ExtractTextPlugin.extract(
			'style',
			'css-loader?sourceMap&minimize!less-loader?sourceMap'
		)} 
	]);
	config.devtool = 'source-map';
	config.debug = false;
}

module.exports = config;

