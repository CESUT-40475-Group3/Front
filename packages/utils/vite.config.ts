import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills(),
        dtsPlugin({
            copyDtsFiles: true,        // copies all .d.ts
            entryRoot: './src',         // source folder
            outDir: './dist',           // output folder
        }),
    ],
    build: {
        outDir: './dist',
        target: ['es6'],
        emptyOutDir: true,
        minify: 'esbuild',
        reportCompressedSize: true,
        lib: {
            entry: 'src/index.ts',       // single entry
            name: 'utils',
            formats: ['es'],
        },
        rollupOptions: {
            treeshake: 'recommended',
            external: ['react', 'react-dom'],
            output: {
                preserveModules: true,       // preserve folder structure
                preserveModulesRoot: './src', // root folder to preserve
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
})
