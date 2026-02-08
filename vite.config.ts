import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
    plugins: [reactRouter(), devtoolsJson(), tsconfigPaths()],
    server: {
        host: '0.0.0.0',
        allowedHosts: true,
        port: 3000,
        hmr: { overlay: false },
    },
});
