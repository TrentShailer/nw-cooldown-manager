const path = require("path"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	CopyPlugin = require("copy-webpack-plugin"),
	{ CleanWebpackPlugin } = require("clean-webpack-plugin"),
	OverwolfPlugin = require("./overwolf.webpack");

module.exports = (env) => ({
	entry: {
		background: "./src/background/background.ts",
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: [
					/node_modules/,
					path.join(__dirname, "./src/in_game/"),
					path.join(__dirname, "./src/prompts/"),
				],
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	output: {
		path: path.resolve(__dirname, "dist/"),
		filename: "js/[name].js",
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "./" },
				{ from: "src/in_game/build", to: "./in_game" },
				{ from: "src/prompts/build", to: "./prompts" },
			],
		}),
		new HtmlWebpackPlugin({
			template: "./src/background/background.html",
			filename: path.resolve(__dirname, "./dist/background.html"),
			chunks: ["background"],
		}),
		new OverwolfPlugin(env),
	],
});
