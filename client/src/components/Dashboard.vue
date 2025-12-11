<template>
  <div class="container text-center">
    <LoginForm :form-message-title="formTitle" />
    <WidgetButtons />
    <SunCoRoutes />
  </div>
</template>

<script setup>
  import LoginForm from '@/components/LoginForm.vue';
  import SunCoRoutes from '@/components/SunCoRoutes.vue';
  import { onMounted, computed } from 'vue';
  import { useUserStore } from '@/stores/store';
  import { storeToRefs } from 'pinia';
  import WidgetButtons from '@/components/WidgetButtons.vue';
  import { useInitSunco } from '@/composables/useSunco';
  import { useInitZDWidget } from '@/composables/useZendesk';

  const userStore = useUserStore();

  const { loginWidgets } = userStore;
  const { authenticated, connectedAs } = storeToRefs(userStore);

  const defaultFormTitle = 'Log back in to sync your past conversations';
  const formTitle = computed(() => {
    return authenticated ? connectedAs : defaultFormTitle;
  });

  onMounted(async () => {
    if (!document.getElementById('web-messenger-container')) {
      useInitSunco();
    }
    if (!document.getElementById('ze-snippet')) {
      useInitZDWidget('ze-snippet', import.meta.env.VITE_MESSAGING_KEY);
    }
    loginWidgets();
  });
</script>
