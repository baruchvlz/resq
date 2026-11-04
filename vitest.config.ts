import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/types.ts'],
            thresholds: {
                lines: 100,
                functions: 100,
                statements: 100,
                branches: 97,
            },
        },
    },
})
