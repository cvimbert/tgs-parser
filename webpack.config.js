var webpack = require("webpack");
var path = require("path");

module.exports = {
    mode: "development",
    entry: path.join(__dirname, './index.ts'),
    watch: true,
    watchOptions: {
      ignored: 'node_modules'
    },
      devServer: {
      contentBase: path.join(__dirname, '.'),
      port: 9000
    },
    plugins: [

    ],
    output: {
        filename: "./tgs-parser.umd.js",
        libraryTarget: 'umd',
        library: "TGSParser"
    },
    resolve: {
        extensions: [".js", ".ts"],
        alias: {
          //core: path.resolve(__dirname, 'core/'),
        }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        }
      ]
    }

};
