<template>
  <ul class="list-group-item">
    <div v-if="loading" class="placeholder-glow">
      <span class="placeholder col-12 placeholder-sm rounded"></span>
    </div>
    <template v-if="!loading">
      <template v-if="label"> {{ label }}: </template>
      <code :class="className">{{ value ?? 'N/A' }}</code>
    </template>
  </ul>
</template>

<script setup>
  defineProps({
    label: {
      type: [String, Object, Number],
      default: '',
    },
    value: {
      type: [String, Object, Boolean, Number],
      default: '',
    },
    className: {
      type: [String, Object],
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
</script>
