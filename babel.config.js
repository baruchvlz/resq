module.exports = {
    'presets': [
        [
            '@babel/preset-env',
        ],
    ],
    'ignore': [
        '.eslintrc.js',
        'babel.config.js',
        'rollup.config.js',
        'tests/',
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
