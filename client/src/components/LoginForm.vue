<template>
  <form id="suncoData" class="row">
    <h4 v-if="!authenticated">
      {{ formMessageTitle }}
    </h4>
    <div class="row justify-content-center">
      <div v-for="field in formFields" :key="field.id" class="col-md-4">
        <VLabel :id="field.id" :name="field.name" className="form-label" />
        <VInput
          :id="field.id"
          v-model="form[field.id]"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder" />
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-auto">
        <VFormActions
          :isFormInvalid="isFormInvalid"
          :authenticated="authenticated"
          :submitForm="submitForm"
          :resetForm="resetForm"
          :michaelScottForm="michaelScottForm"
          :requestJwtToDisplay="requestJwtToDisplay" />
        <VButton
          v-if="!authenticated"
          text="Generate external_id"
          type="button"
          class="formBtn"
          @click="generateExternalId" />
      </div>
    </div>
  </form>
</template>

<script setup>
  import VButton from '@/components/VButton.vue';
  import VInput from '@/components/VInput.vue';
  import VLabel from '@/components/VLabel.vue';
  import VFormActions from '@/components/VFormActions.vue';
  import { useUserStore } from '@/stores/store';
  import {
    useGetToken,
    useSetSessionAuth,
    useShowSuccessToast,
    useGenerateExternalId,
  } from '@/composables/helpers';
  import { ref, computed, shallowRef } from 'vue';
  import { useTitle, useClipboard } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { useLoginUserZDWidget } from '@/composables/useZendesk';
  import { useLoginUserSunCoWidget } from '@/composables/useSunco';

  const userStore = useUserStore();

  const { authenticated } = storeToRefs(userStore);
  const source = ref(null);
  const { copy, copied, isSupported } = useClipboard({ source });

  defineProps({
    formMessageTitle: {
      type: String,
      default: 'Log back in to sync your past conversations',
    },
  });

  const generateExternalId = () => {
    form.value.external_id = useGenerateExternalId();
  };

  const formFields = [
    {
      id: 'external_id',
      name: 'User external_id',
      type: 'text',
      placeholder: 'jane-doe',
    },
    { id: 'name', name: 'User name', type: 'text', placeholder: 'Jane Doe' },
    {
      id: 'email',
      name: 'Email address',
      type: 'email',
      placeholder: 'jane-doe@example.com',
    },
  ];

  const form = ref({
    external_id: null,
    name: null,
    email: null,
  });

  const isFormInvalid = computed(
    () => !form.value.external_id || !form.value.name || !form.value.email,
  );

  const submitForm = async () => {
    const { external_id } = form.value;
    if (isFormInvalid.value) {
      return;
    }
    const userData = Object.assign({}, form.value);
    const { token } = await useGetToken(userData);
    useSetSessionAuth(external_id, token);
    useLoginUserZDWidget(userData);
    useLoginUserSunCoWidget(external_id, token);
    resetForm();
    userStore.changeAuthenticationStatus(true, external_id);
    useTitle(userStore.titleConnectedAs);
  };

  const resetForm = () => {
    form.value = {
      external_id: null,
      name: null,
      email: null,
    };
  };

  const michaelScottForm = () => {
    form.value.external_id = 'm-scott';
    form.value.email = 'michael-scott@example.com';
    form.value.name = 'Michael Scott';
    submitForm();
  };

  const requestJwtToDisplay = async () => {
    if (isFormInvalid.value) {
      return;
    }
    const userData = Object.assign({}, form.value);
    const { token } = await useGetToken(userData);
    console.log('Token requested:', token);
    if (isSupported) {
      copy(token);
      if (copied) {
        useShowSuccessToast('JWT copied to clipboard 📋', 5000);
      }
    }
  };
</script>
