<template>
  <div class="px-4 py-5 my-5 text-center">
    <img src="../assets/zd.svg" alt="Zendesk Logo" />
    <div class="col-lg mx-auto mt-4">
      <h4 class="lead mb-4">
        🚧 This is a dashboard for SunCo/Messaging. It is a work in progress.
      </h4>
      <div class="d-grid gap-2 flex justify-content-sm-center">
        <RouterLink
          v-for="(route, index) in filteredRoutes"
          :key="index"
          :to="route.to"
          :target="route.target"
          class="btn btn-lg"
          v-bind="$attrs">
          {{ route.text }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { suncoRoutes } from '@/router/suncoRoutes';

  const filteredRoutes = computed(() => {
    return suncoRoutes.filter(route => route.to !== '/');
  });
</script>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "layout": "home",
    "title": "Home"
  }
}
</route>
<style lang="css" scoped>
  a:hover {
    background-color: #355e34;
    color: white;
  }

  a {
    background: #f5f5f2;
    border: none;
    color: #16140c;
    margin-bottom: 1px;
  }
</style>
