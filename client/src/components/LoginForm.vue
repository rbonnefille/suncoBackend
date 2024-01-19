<template>
  <form id="suncoData" class="row">
    <h4 v-if="!authenticated">
      {{ formMessageTitle }}
    </h4>
    <div class="row justify-content-center">
      <div v-for="field in formFields" :key="field.id" class="col-auto">
        <VLabel :id="field.id" :name="field.name" className="form-label" />
        <VInput
          :id="field.id"
          v-model="form[field.id]"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
        />
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-auto">
        <VButton
          :button="submitBtn"
          :disabled="isFormInvalid"
          @click.prevent="submitForm"
        />
        <VButton :button="cancelBtn" @click="resetForm" />
        <template v-if="isFormInvalid">
          <VButton
            :button="michaelScottBtn"
            @click.prevent="michaelScottForm"
          />
        </template>
      </div>
    </div>
  </form>
</template>

<script setup>
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VLabel from "@/components/VLabel.vue";
import { useUserStore } from "@/stores/store";
import { getToken, setSessionAuth } from "@/utils/helpers.js";
import { ref, computed } from "vue";
import { useTitle } from "@vueuse/core";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

const { authenticated } = storeToRefs(userStore);

defineProps({
  formMessageTitle: {
    type: String,
    default: "Log back in to sync your past conversations",
  },
});

const formFields = [
  {
    id: "external_id",
    name: "User external_id",
    type: "text",
    placeholder: "jane-doe",
  },
  { id: "name", name: "User name", type: "text", placeholder: "Jane Doe" },
  {
    id: "email",
    name: "Email address",
    type: "email",
    placeholder: "jane-doe@example.com",
  },
];

const form = ref({
  external_id: null,
  name: null,
  email: null,
});

const cancelBtn = {
  btnText: "Reset",
  btnType: "reset",
};
const submitBtn = {
  btnText: "Submit",
  btnType: "submit",
};
const michaelScottBtn = {
  btnText: "Log Michael Scott",
  btnType: "submit",
};

const isFormInvalid = computed(
  () => !form.value.external_id || !form.value.name || !form.value.email
);

const submitForm = async () => {
  const { external_id, name, email } = form.value;
  if (external_id && name && email) {
    const userData = Object.assign({}, form.value);
    const { token } = await getToken(userData);
    setSessionAuth(external_id, token);
    window.zE("messenger", "loginUser", (callback) => {
      callback(token);
      window.zE("messenger", "open");
    });
    window.Smooch.login(external_id, token);
    window.Smooch.open();
    console.log(token);
    resetForm();
    userStore.changeAuthenticationStatus(true, external_id);
    useTitle(userStore.titleConnectedAs);
  }
};

const resetForm = () => {
  form.value = {
    external_id: null,
    name: null,
    email: null,
  };
};

const michaelScottForm = () => {
  form.value.external_id = "m-scott";
  form.value.email = "michael-scott@example.com";
  form.value.name = "Michael Scott";
  submitForm();
};
</script>
