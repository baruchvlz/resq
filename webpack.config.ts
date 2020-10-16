// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const path = require('path')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: ['window', 'resq'],
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',

                },
            },
        ],
    },
}
