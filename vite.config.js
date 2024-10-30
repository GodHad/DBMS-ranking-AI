import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1',
    },
    define: {
        global: {}
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modues')) {
                        return 'vendor';
                    }

                    if (id.includes('some-large-library')) {
                        return 'large-lib'
                    }
                }
            }
        },
        chunkSizeWarningLimit: 300
    },
});
