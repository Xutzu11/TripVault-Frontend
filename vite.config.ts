import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import mkcert from 'vite-plugin-mkcert';
import {viteStaticCopy} from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        mkcert(),
        viteStaticCopy({
            targets: [
                {
                    src: 'public/_redirects', // source file
                    dest: '.', // destination: dist/
                },
            ],
        }),
    ],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    base: '/',
});
