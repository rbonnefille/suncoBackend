<template>
  <h4 class="h4">Availble routes to access SunCo data</h4>
  <div class="p-3 mb-3 m-0 d-inline-flex list-group">
    <RouterLink
      v-if="authenticated"
      id="getUser"
      target="_blank"
      :to="`/sunco/users/${external_id}`"
      class="list-group-item list-group-item-action"
      >Get User data: {{ external_id }}
    </RouterLink>
    <RouterLink
      v-for="(route, index) in additionalRoutes"
      :key="route.to"
      :to="route.to"
      :target="route.target"
      class="list-group-item list-group-item-action"
      v-bind="$attrs"
    >
      {{ route.text }}
    </RouterLink>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { authenticated, external_id } = storeToRefs(userStore);

const additionalRoutes = [
  {
    to: '/',
    target: '',
    text: 'Go to Home page',
  },
  {
    to: '/sunco/integrations',
    target: '_blank',
    text: 'List integrations',
  },
  {
    to: '/sunco/integrations/switchboard',
    target: '_blank',
    text: 'Switchboard Configuration',
  },
  {
    to: '/sunco/snippets/web-widget',
    target: '_blank',
    text: 'SunCo Web Widget Snippets',
  },
  {
    to: '/sunco/users',
    target: '_blank',
    text: 'Search a SunCo User',
  },
];
</script>

<style lang="scss" scoped>
a:hover {
  background-color: #9a4497;
  color: white;
}

a {
  background: #f6f0e6;
  border: none;
  color: #16140c;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
