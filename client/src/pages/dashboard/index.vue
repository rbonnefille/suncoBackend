<template>
  <Dashboard />
</template>

<script setup>
import Dashboard from "@/components/Dashboard.vue";
import { onMounted } from "vue";
import { initSunco } from "@/utils/sunco";
import { initZDWidget } from "@/utils/zendesk";

onMounted(() => {
  if (!document.getElementById("web-messenger-container")) {
    initSunco();
  }
  if (!document.getElementById("ze-snippet")) {
    initZDWidget("ze-snippet", import.meta.env.VITE_MESSAGING_KEY);
  }
});
</script>

<route lang="json">{
  "name": "Dashboard",
  "meta": {
    "title": "Acme Corp Dashboard"
  }
}</route>
