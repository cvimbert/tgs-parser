/**
 * Created by Christophe on 25/10/2017.
 */
var webpack = require("webpack");
var path = require("path");

module.exports = {
    mode: "development",
    entry: './test.ts',
    output: {
        filename: "./tgs-parser.umd.js",
        libraryTarget: 'umd',
        library: "TGSParser"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts"],
        alias: {
          core: path.resolve(__dirname, 'core/'),
        }
    },
    module: {
      rules: [
    // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    }

};
