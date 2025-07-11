import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
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
