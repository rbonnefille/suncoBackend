<template>
  <div class="mb-4 container">
    <div v-if="errorMessage">
      <VError :errorMessage="errorMessage" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <PulseLoader
        :loading="isLoading"
        :color="'#03363d'"
        :size="`20px`"
      ></PulseLoader>
    </div>
    <div v-else>
      <div class="row">
        <div
          v-for="integration in integrationsByType"
          :key="integration.id"
          class="col-md-3"
        >
          <div class="card m-3">
            <div class="card-header">
              <span>
                <img
                  :src="
                    integrationIcons[integration.type] ||
                    integrationIcons.default
                  "
                  :alt="integration.type"
                  width="20"
                  height="20"
                  class="align-middle"
                />
                {{
                  integration.displayName ? integration.displayName : "custom"
                }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="integration.id" />
              <VDataItem
                label="status"
                :value="
                  integration.status === 'active' ? '✅' : integration.status
                "
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { integrationIcons } from "@/utils/integrationIcons.js";
import VDataItem from "@/components/VDataItem.vue";
import VError from "@/components/VError.vue";
import router from "@/router/index.js";

const isLoading = ref(false);
const integrations = ref([]);
const errorMessage = ref(null);

const integrationsByType = computed(() => {
  return integrations.value.slice(0).sort((a, b) => {
    if (a.type < b.type) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    }
    return 0;
  });
});

const fetchIntegrations = async () => {
  try {
    isLoading.value = true;
    const response = await fetch("/integrations");
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    integrations.value = data.integrations;
    isLoading.value = false;
  } catch (error) {
    errorMessage.value = error.message;
    setTimeout(() => {
      router.go(-1);
    }, 2000);
  }
};

onBeforeMount(async () => {
  await fetchIntegrations();
});
</script>

<route lang="json">
{
  "name": "SunCo integrations",
  "meta": {
    "title": "SunCo integrations"
  }
}
</route>
