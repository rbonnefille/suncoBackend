<template>
  <div>
    <h4 class="mt-5">Metadata were set with</h4>
    <div>
      <code>{{ metadataCode }}</code>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    metadataCode: { type: String, required: true },
  });
</script>
