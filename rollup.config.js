import babel from 'rollup-plugin-babel'

export default {
    input: './index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            name: 'resq',
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'resq',
        },
    ],
    plugins: [
        babel({
            'presets': [
                [
                    '@babel/preset-env',
                ],
            ],
            'ignore': [
                'node_modules',
                '.eslintrc.js',
            ],
            'runtimeHelpers': true,
            'plugins': [
                ['@babel/plugin-transform-runtime', {
                    'regenerator': true,
                }],
            ],
        }),
    ],
}
