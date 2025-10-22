<template>
  <motion.button
    :whileHover="{ scale: 1.1 }"
    :whilePress="{ scale: 0.8 }"
    :type="type"
    v-bind="$attrs"
    :class="classes">
    {{ text }}
  </motion.button>
</template>

<script setup>
  import { computed } from 'vue';
  import { motion } from 'motion-v';

  const props = defineProps({
    text: { type: String, default: 'Button Text' },
    type: { type: String, default: 'button' },
    class: { type: String, default: '' },
  });

  const classes = computed(() => [
    'btn',
    'rounded-4',
    props.class || 'customBtn',
  ]);
</script>
