import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        sourcemap: true,
        target: 'es2020',
    },
    {
        entry: ['src/index.ts'],
        format: ['iife'],
        globalName: 'resq',
        // same global as v1, also when the script is injected by an automation tool
        footer: { js: 'if (typeof window !== "undefined") { window.resq = resq; }' },
        minify: true,
        target: 'es2020',
    },
])
