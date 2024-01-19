<template>
  <footer class="fixed-bottom">
    <p>{{ userAgent }} - Locale: {{ browserLocale }}</p>
  </footer>
</template>

<script setup>
import { ref } from "vue";

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
  background: radial-gradient(
    circle,
    rgba(2, 0, 36, 1) 0%,
    rgba(3, 54, 61, 0.9508196721311475) 100%
  );
  opacity: 0.98;
  opacity: 0.98;
  height: 15px;
}
</style>
