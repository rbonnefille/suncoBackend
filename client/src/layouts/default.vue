<template>
  <TheNavbar
    :title="
      route.params.id
        ? `${route.meta.title} ${route.params.id}`
        : route.meta.title
    "
  />
  <RouterView />
  <TheFooter />
</template>

<script setup>
import TheNavbar from "@/components/TheNavbar.vue";
import TheFooter from "@/components/TheFooter.vue";
import { useRoute } from "vue-router";

const route = useRoute();

defineProps({
  title: {
    type: String,
    required: false,
    default: "Acme corp Dashboard",
  },
});
</script>
