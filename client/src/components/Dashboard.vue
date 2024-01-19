<template>
  <div class="container text-center">
    <LoginForm :form-message-title="formTitle" />
    <WidgetButtons />
    <SunCoRoutes />
  </div>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
import SunCoRoutes from "@/components/SunCoRoutes.vue";
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import WidgetButtons from "@/components/WidgetButtons.vue";

const userStore = useUserStore();

const { loginWidgets } = userStore;
const { authenticated, connectedAs } = storeToRefs(userStore);

const defaultFormTitle = "Log back in to sync your past conversations";
const formTitle = computed(() => {
  return authenticated ? connectedAs : defaultFormTitle;
});

onMounted(async () => {
  loginWidgets();
});
</script>

<style>
h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
