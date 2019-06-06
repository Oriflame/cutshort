const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	'devtool': false,
	'context': path.resolve(__dirname, 'src'),
	'plugins': [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['lib']
		})
	],
	'entry': {
		'index': './index.ts'
	},
	'output': {
		'path': path.resolve(__dirname, 'lib'),
		'filename': '[name].js',
		'libraryTarget': 'umd'
	},
	'module': {
		'rules': [
			{
				'test': /\.(ts)$/,
				'include': /src/,
				'exclude': /node_modules/,
				'use': [
					{
						'loader': 'ts-loader'
					}
				]
			}
		]
	},
	'resolve': {
		'extensions': ['.ts']
	}
};

module.exports = config;