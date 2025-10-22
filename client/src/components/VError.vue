<template>
  <div class="alert alert-danger" role="alert">
    {{ errorMessage }}
  </div>
</template>

<script setup>
defineProps({
  errorMessage: {
    type: String,
    required: true,
    default: "Something went wrong. Please try again later.",
  },
});
</script>