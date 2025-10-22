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
    </div>
  </nav>
</template>

<script setup>
  import { useUserStore } from '@/stores/store';
  const userStore = useUserStore();

  defineProps({
    title: {
      type: String,
      required: false,
      default: 'Acme corp Dashboard',
    },
  });
</script>
