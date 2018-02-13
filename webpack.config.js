const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname + '/public',
        filename: './app.js'
    },
    devServer: {
        port: 3000,
        contentBase: './public'
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            modules: __dirname + '/node_modules'
        }
    },
    plugins: [
        new ExtractTextPlugin('app.css')
    ],
    module: {
        loaders: [{
            test: /.js[x]?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015'],
                plugins: ['transform-object-rest-spread']
            }
        }, {
          test: /\.(scss|css)$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass', { publicPath: './' })
        }, {
            test: /\.less$/, loader: 'style-loader!css-loader!less-loader'
          }, {
            test: /\.woff|.woff2|.ttf|.eot|.svg*.*$/,
            loader: 'file'
        }, { test: /\.html$/, loader: "html" }]
    }
}
