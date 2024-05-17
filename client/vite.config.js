import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Layouts from 'vite-plugin-vue-layouts';

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/vue-sunco-dashboard/",
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
    Components({ dirs: ['./src/components'] }),
  ],
  server: {
    fs: {
      cachedChecks: false,
    },
    proxy: {
      '/auth': 'http://127.0.0.1:3000/',
      '/integrations': 'http://127.0.0.1:3000/',
      '/users': 'http://127.0.0.1:3000/',
      '/integrations/sbintegrations': 'http://127.0.0.1:3000/',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
