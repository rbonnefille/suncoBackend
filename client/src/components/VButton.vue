<template>
  <button :type="type" v-bind="$attrs" class="btn rounded-4">
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true, default: "Button Text" },
  type: { type: String, required: true, default: "button" },
});
</script>

<style lang="scss" scoped>
button,
button:disabled {
  background: #f6f0e6;
  border: none;
  color: #16140c;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

button:focus,
button:hover {
  background-color: #9a4497;
  color: #ffffff;
}

// button:focus {
//     background-color: #9a4497;
//     color: white;
// }
</style>
