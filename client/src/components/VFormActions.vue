<template>
  <VButton
    text="Submit"
    type="submit"
    class="formBtn"
    :disabled="isFormInvalid"
    @click.prevent="submitForm" />
  <VButton text="Reset" type="reset" class="formBtn" @click="resetForm" />
  <template v-if="!authenticated">
    <VButton
      text="Log Michael Scott"
      type="submit"
      class="formBtn"
      @click.prevent="michaelScottForm" />
    <VButton
      text="JWT to clipboard"
      type="submit"
      class="formBtn"
      @click.prevent="requestJwtToDisplay" />
  </template>
</template>

<script setup>
  import VButton from '@/components/VButton.vue';

  defineProps({
    isFormInvalid: { type: Boolean, required: true },
    authenticated: { type: Boolean, required: true },
    submitForm: { type: Function, required: true },
    resetForm: { type: Function, required: true },
    michaelScottForm: { type: Function, required: true },
    requestJwtToDisplay: { type: Function, required: true },
  });
</script>
