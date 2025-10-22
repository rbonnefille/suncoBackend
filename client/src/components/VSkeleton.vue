<template>
  <ul class="list-group-item">
    <div v-if="loading" class="placeholder-glow">
      <span class="placeholder col-12 placeholder-sm rounded"></span>
    </div>
  </ul>
</template>

<script setup>
  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });
</script>
