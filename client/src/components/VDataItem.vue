<template>
  <ul class="list-group-item">
    {{
      label
    }}:
    <code :class="className">{{
      value === undefined || value === null ? "N/A" : value
    }}</code>
  </ul>
</template>

<script setup>
defineProps({
  label: {
    type: [String, Object, Number],
    required: true,
    default: "",
  },
  value: {
    type: [String, Object, Boolean, Number],
    required: true,
    default: "",
  },
  className: {
    type: [String, Object],
    default: "",
  },
});
</script>
