<template>
  <footer class="fixed-bottom">
    <p>{{ userAgent }} - Locale: {{ browserLocale }}</p>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const userAgent = ref(window.navigator.userAgent);
const browserLocale = ref(window.navigator.language);
</script>

<style lang="scss" scoped>
p {
  margin-left: 20px;
  text-align: left;
  text-size-adjust: auto;
  font-size: x-small;
  color: #ffffff;
}

footer {
  background: #16140c;
  opacity: 0.98;
  opacity: 0.98;
  height: 15px;
}
</style>
