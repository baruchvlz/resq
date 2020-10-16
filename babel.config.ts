// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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
