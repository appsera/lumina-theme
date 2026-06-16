/* =====================================================================
   LUMINA — webpack build config
   Compiles SCSS -> public/app.css and bundles JS entry points that the
   Twig templates reference via the |asset filter, e.g. {{ 'lumina.js'|asset }}.
   Each entry name maps to public/<name>.js or public/<name>.css.
   ===================================================================== */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const asset = file => path.resolve('src/assets', file || '');
const pub = file => path.resolve("public", file || '');

module.exports = {
    entry: {
        // app.css (styles) + global app behaviour
        app: [asset('styles/app.scss')],
        // Lumina core runtime (sticky header, reveals, sticky ATC, etc.)
        lumina: asset('js/lumina.js'),
        // Page bundles — loaded per-page via {% block scripts %}
        home: asset('js/home.js'),
        product: asset('js/product.js'),
        products: asset('js/products.js'),
        cart: asset('js/cart.js'),
        // Partials referenced directly in master.twig <head>
        'product-card': asset('js/partials/product-card.js'),
        'add-product-toast': asset('js/partials/add-product-toast.js'),
    },
    output: {
        path: pub(),
        clean: true,
        chunkFilename: "[name].[contenthash].js"
    },
    stats: { modules: false, assetsSort: "size", assetsSpace: 50 },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/(node_modules)/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [["@babel/plugin-transform-runtime", { "regenerator": true }]],
                    }
                }
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false } },
                    "postcss-loader",
                    "sass-loader",
                ]
            },
        ],
    },
    plugins: [
        new ThemeWatcher(),
        new MiniCssExtractPlugin(),
        new CopyPlugin({ patterns: [{ from: asset('images'), to: pub('images') }] }),
    ],
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
};
