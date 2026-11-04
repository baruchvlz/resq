import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['bench/baseline-v1', 'dist', 'coverage', 'docs/.vitepress/cache', 'docs/.vitepress/dist', 'docs/api'] },
    ...tseslint.configs.recommended,
    {
        rules: {
            'id-length': ['error', { min: 2, exceptions: [] }],
            'no-console': 'error',
        },
    },
)
