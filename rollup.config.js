// Rollup plugins
import babel from 'rollup-plugin-babel'
import babelConfig from './babel.config'

export default {
    input: './index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            name: 'resq',
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'resq',
        },
    ],
    plugins: [
        babel(babelConfig),
    ],
}
