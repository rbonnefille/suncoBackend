<template>
  <button
    :type="button.btnType"
    @click="button.btnClick"
    v-bind="$attrs"
    class="btn rounded-4"
  >
    {{ button.btnText }}
  </button>
</template>

<script setup>
const props = defineProps({
  button: {
    btnText: { type: String, required: true, default: 'Button Text' },
    btnType: { type: String, required: true, default: 'button' },
    btnClick: { type: Function, required: true, default: () => {} },
  },
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
