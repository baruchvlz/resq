module.exports = {
    'presets': [
        [
            '@babel/preset-typescript',
            '@babel/preset-env',
        ],
    ],
    'ignore': [
        '.eslintrc.js',
        'babel.config.js',
        'rollup.config.js',
        'scripts/',
        'node_modules/',
        'dist/',
    ],
    'plugins': [
        ['@babel/plugin-transform-runtime', {
            'regenerator': true,
        }],
    ],
}
