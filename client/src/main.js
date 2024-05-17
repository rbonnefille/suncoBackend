import { createApp, computed } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { createPinia } from 'pinia';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { useFavicon, usePreferredDark } from '@vueuse/core';

const isDark = usePreferredDark();

const favicon = computed(() =>
  isDark.value ? '../whiteFavicon.png' : '../darkFavicon.png'
);

useFavicon(favicon);
const pinia = createPinia();
const app = createApp(App);

const options = {
  transition: 'Vue-Toastification__fade',
  maxToasts: 15,
  newestOnTop: true,
};

app.use(Toast, options);
app.use(pinia);
app.use(router);
app.mount('#app');
