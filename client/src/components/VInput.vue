<template>
  <div class="d-flex">
    <input
      :value="modelValue"
      :id="id"
      :name="name"
      :type="type"
      :class="inputClass"
      :placeholder="placeholder"
      :required="required"
      :checked="checked"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <slot name="end"></slot>
  </div>
</template>

<script setup>
import { useAttrs, computed } from "vue";

const attrs = useAttrs();

defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "input",
  },
  name: {
    type: String,
    default: "input",
  },
  type: {
    type: String,
    default: "input",
  },
  className: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "input",
  },
  required: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

// const labelClass = computed(() => {
//   return props.type === "checkbox" ? "form-check-label" : "form-label";
// });

const inputClass = computed(() => {
  return props.type === "checkbox"
    ? "form-check-input"
    : "form-control rounded-4";
});
</script>

<style lang="css" scoped>
input:focus,
input[type="text"]:focus,
input[type="email"]:focus {
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
  border-color: #16140c;
  outline: 0;
  box-shadow: -2px 5px 2px 0rem #9a4497;
}
</style>
