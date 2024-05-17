<template>
  <label class="form-label">{{ label }}</label>
  <select :value="modelValue" class="form-select form-select-sm"
    @change="$emit('update:modelValue', $event.target.value)" v-bind="$attrs">
    <option disabled value="">{{ optionHint }}</option>
    <option v-for="option in options" :key="option.id" :value="option.id">
      {{ option.name || option.id || option }}
    </option>
  </select>
</template>

<script setup>
defineEmits(["update:modelValue"]);

defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    required: true,
  },
  optionHint: {
    type: String,
    default: "Please select one",
  },
  options: {
    type: Array,
    required: true,
  },
});
</script>
