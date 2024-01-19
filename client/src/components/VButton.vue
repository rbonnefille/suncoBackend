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
    btnText: { type: String, required: true, default: "Button Text" },
    btnType: { type: String, required: true, default: "button" },
    btnClick: { type: Function, required: true, default: () => {} },
  },
});
</script>

<style lang="scss" scoped>
button {
  background: #d6eef1;
  border: none;
  color: #03363d;
  text-align: center;
  text-decoration: none;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}

button:focus,
button:hover {
  background-color: #03363d;
  color: white;
}

// button:focus {
//     background-color: #03363d;
//     color: white;
// }
</style>
