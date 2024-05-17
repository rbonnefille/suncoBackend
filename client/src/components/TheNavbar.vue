<template>
  <nav class="navbar shadow-lg p-3 mb-3 text-white">
    <div class="justify-content-center container-fluid">
      <RouterLink class="btn btn-sm text-white" to="/">Home</RouterLink>
      <h2>
        {{
          userStore.authenticated
            ? `Welcome back ${userStore.external_id}`
            : `${title}`
        }}
      </h2>
      <button @click="toggleDark()" class="btn btn-sm text-white">
        <template v-if="isDark">
          <MoonIcon style="height: 24px; height: 24px;" />
        </template>
        <template v-else>
          <SunIcon style="height: 24px; height: 24px;" />
        </template>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "@/stores/store";
import { useDark, useToggle } from '@vueuse/core';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'



const htmlTag = document.querySelector('html');

const isDark = useDark({
  onChanged(dark) {
    if (dark) {
      htmlTag.setAttribute('data-bs-theme', 'dark');
    } else {
      htmlTag.setAttribute('data-bs-theme', 'light');
    }
  },
});
const toggleDark = useToggle(isDark)

const userStore = useUserStore();

defineProps({
  title: {
    type: String,
    required: false,
    default: "Acme corp Dashboard",
  },
});
</script>

<style scoped>
nav {
  background: #16140c;
}
</style>
