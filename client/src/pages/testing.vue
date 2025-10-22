<template>
  <div>
    <div class="d-flex justify-content-center align-items-center mt-5">
      <VButton text="Open Widget" type="button" @click="openWidget" />
      <VButton text="Close Widget" type="button" @click="closeWidget" />
      <!-- <iframe src="https://apps.usw2.pure.cloud/crm/index.html" style="width: 200px; height: 450px; border: none;"
        allow="autoplay *; camera *; geolocation *; microphone *; hid *"></iframe> -->
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useInitZDWidget } from '@/composables/useZendesk';
  import VButton from '@/components/VButton.vue';

  const openWidget = () => {
    zE('messenger', 'open');
  };

  const closeWidget = () => {
    zE('messenger', 'close');
  };

  onMounted(() => {
    if (!document.getElementById('ze-snippet')) {
      useInitZDWidget('ze-snippet', import.meta.env.VITE_MESSAGING_APAC_KEY);
    }
  });
</script>

<route lang="json">
{
  "name": "Testing area",
  "meta": {
    "title": "Testing area"
  }
}
</route>
