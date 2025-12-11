<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<script setup>
  import { shallowRef, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const currentLayout = shallowRef();

  // Map of layout names to their components
  const layouts = {
    default: () => import('@/layouts/default.vue'),
    home: () => import('@/layouts/home.vue'),
    404: () => import('@/layouts/404.vue'),
  };

  const loadLayout = async layoutName => {
    try {
      const layout = layoutName || (route.path === '/' ? 'home' : 'default');
      const layoutModule = await layouts[layout]();
      currentLayout.value = layoutModule.default;
    } catch (error) {
      console.error(`Failed to load layout: ${layoutName}`, error);
      const defaultLayout = await layouts.default();
      currentLayout.value = defaultLayout.default;
    }
  };

  // Watch for route changes and load the appropriate layout
  router.afterEach(to => {
    loadLayout(to.meta.layout);
  });

  onMounted(async () => {
    await router.isReady();
    loadLayout(route.meta.layout);
  });
</script>
