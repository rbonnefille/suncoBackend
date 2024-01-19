<template>
  <template v-if="name"> </template>
  <label :for="id" :class="className">{{ name }}</label>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "input",
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
