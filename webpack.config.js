/* eslint-disable strict, no-console, object-shorthand */
/* eslint-disable import/no-extraneous-dependencies, import/newline-after-import */
'use strict';

const path = require('path');

const webpack = require('webpack');
const autoPrefixer = require('autoprefixer');
const combineLoaders = require('webpack-combine-loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const EXTRACT = process.env.NODE_ENV === 'extract';

const PATHS = {
    BUILD: path.resolve(__dirname, 'build'),
    BUNDLE: path.resolve(__dirname, 'bundle'),
    MODULES: path.resolve(__dirname, 'modules'),
    NODE_MODULES: path.resolve(__dirname, 'node_modules')
};

// External libraries
// Catch all react lib related imports
const externals = [
    /^react(-dom|-addons.*)?$/
];

// Plugins
const plugins = [
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    }),
    new webpack.NoErrorsPlugin()
];

const extractPlugins = [
    new ExtractTextPlugin(PRODUCTION ? 'styles.min.css' : 'styles.css', {
        allChunks: true
    }),
];

const prodPlugins = [
    ...extractPlugins,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false
        },
        output: {
            comments: false
        },
        sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
    })
];

if (PRODUCTION) {
    plugins.push(...prodPlugins);
}

if (EXTRACT) {
    plugins.push(...extractPlugins);
}

// Loaders
// CSS
const CSS_MODULES_LOADER_SPEC = [
    {
        loader: 'css',
        query: {
            modules: true,
            importLoaders: 2,
            localIdentName: '[path]__[name]__[local]_[hash:base64:5]',
            sourceMap: true
        }
    },
    {
        loader: 'postcss'
    },
];
const CSS_MODULES_LOADER = combineLoaders(CSS_MODULES_LOADER_SPEC);

// SASS
const SASS_LOADER_SPEC = CSS_MODULES_LOADER_SPEC.concat([
    {
        loader: 'sass',
        query: {
            precision: '8', // See https://github.com/twbs/bootstrap-sass#sass-number-precision
            outputStyle: 'expanded',
            sourceMap: true
        }
    }
]);
const SASS_LOADER = combineLoaders(SASS_LOADER_SPEC);


const config = {
    entry: [
        PRODUCTION || EXTRACT ? 'bootstrap-loader/extractStyles' : 'bootstrap-loader',
        PATHS.MODULES
    ],

    output: {
        filename: PRODUCTION ? 'bundle.min.js' : 'bundle.js',
        library: 'ascribe-react-components',
        libraryTarget: 'umd',
        path: PRODUCTION ? PATHS.BUNDLE : PATHS.BUILD
    },

    externals: PRODUCTION ? externals : null,

    debug: !PRODUCTION,

    devtool: PRODUCTION ? '#source-map' : '#inline-source-map',

    resolve: {
        // Dedupe any dependencies' polyfill, react, or react-css-modules dependencies when
        // developing with npm link
        alias: {
            'babel-runtime': path.resolve(PATHS.NODE_MODULES, 'babel-runtime'),
            'core-js': path.resolve(PATHS.NODE_MODULES, 'core-js'),
            'js-utility-belt': path.resolve(PATHS.NODE_MODULES, 'js-utility-belt'),
            'react': path.resolve(PATHS.NODE_MODULES, 'react'),
            'react-dom': path.resolve(PATHS.NODE_MODULES, 'react-dom'),
            'react-css-modules': path.resolve(PATHS.NODE_MODULES, 'react-css-modules'),
        },
        extensions: ['', '.js'],
        modules: ['node_modules'], // Don't use absolute path here to allow recursive matching
    },

    plugins: plugins,

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [PATHS.NODE_MODULES],
                loader: 'babel',
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.s[ac]ss$/,
                exclude: [PATHS.NODE_MODULES],
                loader: PRODUCTION || EXTRACT ? ExtractTextPlugin.extract('style', SASS_LOADER)
                                              : `style!${SASS_LOADER}`
            },
            {
                test: /\.css$/,
                exclude: [PATHS.NODE_MODULES],
                loader: PRODUCTION || EXTRACT ? ExtractTextPlugin.extract('style', CSS_MODULES_LOADER)
                                              : `style!${CSS_MODULES_LOADER}`
            }
        ]
    },

    postcss: [autoPrefixer()]
};

module.exports = config;
