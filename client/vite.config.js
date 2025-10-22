import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Layouts from 'vite-plugin-vue-layouts';
import MotionResolver from 'motion-v/resolver';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      extensions: ['.vue'],
      importMode: 'async',
      dts: './typed-router.d.ts',
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      pagesDirs: 'src/pages',
      defaultLayout: 'default',
    }),
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      directives: true,
      resolvers: [MotionResolver()],
    }),
  ],
  server: {
    fs: {
      cachedChecks: false,
    },
    proxy: {
      '/auth': 'http://127.0.0.1:3000/',
      '/integrations': 'http://127.0.0.1:3000/',
      '/users': 'http://127.0.0.1:3000/',
      '/zendesk/login': 'http://127.0.0.1:3000/',
      '/notifications/sms': 'http://127.0.0.1:3000/',
      '/switchboards': 'http://127.0.0.1:3000/',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
