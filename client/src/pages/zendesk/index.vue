<template>
  <div class="container mt-5">
    <form id="suncoData" class="row">
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
        </div>
      </div>
    </form>
    <div class="row justify-content-center mt-5">
      <div class="col-4">
        <h4 class="h4">Other Zendesk links</h4>
        <div id="list-example" class="list-group">
          <a
            class="list-group-item list-group-item-action"
            href="https://z3nsuncoswitchboard.zendesk.com/agent"
            >Agent login portal</a
          >
          <a
            class="list-group-item list-group-item-action"
            href="https://z3nsuncoswitchboard.zendesk.com/hc"
            >End-user login portal</a
          >
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center mt-5">
    <div class="col-auto">
      <h4 class="h4">Search Help Center articles</h4>
      <div class="d-flex mb-4">
        <VInput
          id="searchKb"
          v-model="searchQuery"
          name="search"
          type="text"
          placeholder="Search"
          @keyup.enter="searchKB"
        />
        <VButton
          class="mx-2"
          :button="{ btnText: 'Search', btnType: 'submit' }"
          @click="searchKB"
        >
        </VButton>
      </div>
      <ul>
        <PulseLoader
          :loading="isLoading"
          :color="'#03363d'"
          :size="`20px`"
        ></PulseLoader>
        <li class="mt-1" v-for="result in searchResults" :key="result.id">
          <a :href="result.html_url" target="_blank">{{ result.title }}</a>
        </li>
        <p v-if="error">{{ error }}</p>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import VLabel from "@/components/VLabel.vue";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const isLoading = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const error = ref("");

const searchKB = async () => {
  isLoading.value = true;
  clearPreviousResults();
  const search_string = encodeURIComponent(searchQuery.value);
  const url = `https://z3nsuncoswitchboard.zendesk.com/api/v2/help_center/articles/search.json?query=${search_string}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      showResults(data);
    } else {
      throw new Error("Request error");
    }
  } catch (error) {
    showError(error);
  } finally {
    isLoading.value = false;
  }
};

const showResults = (data) => {
  searchResults.value = data.results;
  if (data.results.length === 0) {
    error.value = "No results";
  }
};

const showError = (error) => {
  error.value = error;
};

const clearPreviousResults = () => {
  searchResults.value = [];
  error.value = "";
};

const form = ref({
  external_id: "john-john",
  name: "john-john",
  email: "john-john@test.com",
  role: "agent",
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
  { id: "role", name: "User role", type: "text", placeholder: "admin" },
];

const cancelBtn = {
  btnText: "Reset",
  btnType: "reset",
};
const submitBtn = {
  btnText: "Login to Zendesk",
  btnType: "submit",
};

const isFormInvalid = computed(
  () =>
    !form.value.external_id ||
    !form.value.name ||
    !form.value.email ||
    !form.value.role
);

const submitForm = async () => {
  const { external_id, name, email, role } = form.value;
  if (external_id && name && email && role) {
    try {
      const response = await fetch(
        `/zendesk/login?name=${name}&email=${email}&external_id=${external_id}&role=${role}`
      );
      const data = await response.json();
      console.log("Success:", data);
      resetForm();
      window.location.href = `https://z3nsuncoswitchboard.zendesk.com/access/jwt?jwt=${data.token}`;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const resetForm = () => {
  form.value = {
    external_id: null,
    name: null,
    email: null,
    role: null,
  };
};
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
</style>

<route lang="json">
{
  "name": "Zendesk Tools",
  "meta": {
    "title": "Zendesk Tools"
  }
}
</route>
