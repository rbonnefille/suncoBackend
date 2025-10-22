<template>
  <div class="col-auto" role="group" :aria-label="label">
    <VButton
      v-for="(button, key) in buttons"
      :key="key"
      :class="className"
      :text="button.text"
      :type="button.type"
      @click="button.click" />
  </div>
</template>

<script setup>
  import VButton from '@/components/VButton.vue';

  defineProps({
    label: { type: String, required: true },
    buttons: { type: Object, required: true },
    className: { type: String, default: '' },
  });
</script>
