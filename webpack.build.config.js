const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AutoDllPlugin = require('autodll-webpack-plugin');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');


// html-webpack-plugin插件，webpack中生成HTML的插件，
// 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

console.log('BUILD_ENV >>>', process.env.BUILD_ENV);
//console.log('webpack.DefinePlugin', webpack);


const BUILD_ENV = process.env.BUILD_ENV;

const PUBLIC_PATH = {
    'dev': 'http://dev.yourhost.com/antd-admin/',
    'test': 'http://test.yourhost.com/antd-admin/',
    'prod': 'http://myqianlan.com/antd-admin-boilerplate/dist/',
};

let webpackConfig = {
    resolve: {
        modules: ['node_modules', './node_modules'],
        extensions: ['.js', '.jsx'],
        unsafeCache: true,
        alias: {
            'component': path.resolve(__dirname, './src/component'),
            'common': path.resolve(__dirname, './src/common'),
            'framework': path.resolve(__dirname, './src/framework'),
            'api': path.resolve(__dirname, './src/common/util/api.js')
        }
    },
    resolveLoader: {
        modules: ['node_modules', './node_modules']
    },

    entry: {
        index: './src/entry/index.jsx',
        vendor: ['jquery', 'classnames', 'react', 'react-dom', 'react-router']
    },
    cache: true,
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: PUBLIC_PATH[BUILD_ENV],
        filename: '[name].[chunkHash:8].js',
        chunkFilename: "[name].[chunkHash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                    ]
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            'sass-loader',

                        ]
                    })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            'less-loader',
                        ]
                    })
            }, {
                test: /\.(png|jpg|jpeg|gif)$/i,
                loader: 'url-loader?name=[hash:8].[ext]&limit=8192',
            }, {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src"
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            },

        ]
    },
    plugins: [
        // new UglifyJSPlugin(),
        new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'windows.jQuery': 'jquery',
        }),
        new ExtractTextPlugin('[name].[contenthash:8].css', {
            disable: false,
            allChunks: true
        }),

        new CompressionWebpackPlugin({               //gzip 压缩
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css)$/,                    //压缩 js 与 css
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new webpack.optimize.CommonsChunkPlugin({
            async: 'common-in-lazy',
            minChunks: ({resource} = {}) => (
                resource &&
                resource.includes('node_modules')
            ),
        }),

        new webpack.optimize.CommonsChunkPlugin({
            async: 'used-twice',
            minChunks: (module, count) => (
                count >= 2
            ),
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false, //去掉注释
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
            }
        }),
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            filename: './index.html', //生成的html存放路径，相对于path
            template: './src/entry/index.html.ejs', //html模板路径
            title: '德智金服',
            favicon: './src/entry/logoWithoutName.png',
            inject: true, //js插入的位置，true/'head'/'body'/false
            hash: false, //为静态资源生成hash值
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            },
            chunksSortMode: 'dependency',
            externalsAssets: {}
        }),
        // new AutoDllPlugin({
        //     inject: true, // will inject the DLL bundle to index.html
        //     debug: true,
        //     filename: '[name].[hash:8].js',
        //     path: './dll',
        //     entry: {
        //         vendor: ['jquery', 'moment', 'classnames', 'react', 'react-dom', 'react-router', 'antd']
        //     }
        // })
    ]
};

module.exports = webpackConfig;
