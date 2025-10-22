<template>
  <h4 class="h4 mt-3">App routes ⤵️</h4>
  <div class="mb-3 m-0 d-inline-flex list-group">
    <RouterLink
      v-if="authenticated"
      id="getUser"
      target="_blank"
      :to="`/sunco/users/${external_id}`"
      class="btn routes"
      >Get User data: {{ external_id }}
    </RouterLink>
    <RouterLink
      v-for="(route, index) in filteredRoutes"
      :key="index"
      :to="route.to"
      class="btn routes"
      v-bind="$attrs">
      {{ route.text }}
    </RouterLink>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/stores/store';
  import { storeToRefs } from 'pinia';
  import { suncoRoutes } from '@/router/suncoRoutes';
  import { computed } from 'vue';

  const userStore = useUserStore();
  const { authenticated, external_id } = storeToRefs(userStore);

  const filteredRoutes = computed(() => {
    return suncoRoutes.filter(route => route.to !== '/dashboard');
  });
</script>
