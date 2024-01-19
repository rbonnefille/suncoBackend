<template>
  <div class="container">
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
        <h3 class="h3 mb-2">Switchboard Integrations</h3>
        <div
          v-for="sbintegration in switchboardIntegrations"
          :key="sbintegration.id"
          class="col-md-4"
        >
          <div class="card mt-2">
            <div class="card-header">
              <span>
                <img
                  :src="
                    integrationIcons[sbintegration.integrationType] ||
                    integrationIcons.default
                  "
                  :alt="sbintegration.type"
                  width="20"
                  height="20"
                  class="align-middle"
                />
                {{ sbintegration.name }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="sbintegration.id" />
              <VDataItem
                label="integrationId"
                :value="sbintegration.integrationId"
              />
              <VDataItem
                label="deliverStandbyEvents"
                :value="sbintegration.deliverStandbyEvents"
              />
              <VDataItem
                label="nextSwitchboardIntegrationId"
                :value="sbintegration.nextSwitchboardIntegrationId"
              />
              <VDataItem
                v-if="sbintegration.messageHistoryCount"
                label="messageHistoryCount"
                :value="sbintegration.messageHistoryCount"
              />
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-5 mb-4 row">
        <h3 class="h3 mb-2">
          {{
            isLoadingSwitchboardUpdate ? "Updating Switchboard" : "Switchboards"
          }}
          <PulseLoader
            :loading="isLoadingSwitchboardUpdate"
            :color="'#03363d'"
            :size="`15px`"
            :style="{ display: 'inline-block' }"
          ></PulseLoader>
        </h3>
        <div class="col">
          <div class="card mt-2">
            <div class="card-header bg-body-secondary">Switchboard</div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="switchboards.id" />
              <ul class="list-group-item">
                <VSelect
                  v-model="isSwitchboardEnabled"
                  label="Change Switchboard State"
                  option-hint="Select a state"
                  :options="['Enabled', 'Disabled']"
                />
              </ul>
              <ul class="list-group-item">
                <VSelect
                  v-model="defaultSwitchboardIntegrationIdSelected"
                  label="Change default Switchboard Integration"
                  option-hint="Select an integration"
                  :options="switchboardIntegrations"
                />
              </ul>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { integrationIcons } from "@/utils/integrationIcons.js";
import VDataItem from "@/components/VDataItem.vue";
import VSelect from "@/components/VSelect.vue";
import VError from "@/components/VError.vue";
import router from "@/router/index.js";
import {
  isLoadingSwitchboardUpdate,
  switchboards,
  updateSwitchboard,
} from "@/utils/sunco.js";

const isLoading = ref(false);
const switchboardIntegrations = ref(null);
const defaultSwitchboardIntegrationIdSelected = ref(null);
const isSwitchboardEnabled = ref(null);
const errorMessage = ref(null);

watch(defaultSwitchboardIntegrationIdSelected, (newValue, oldValue) => {
  if (oldValue !== null || undefined) {
    updateSwitchboard(switchboards.value.enabled, newValue);
  }
});

watch(isSwitchboardEnabled, (newValue, oldValue) => {
  if (oldValue !== null || undefined) {
    updateSwitchboard(
      newValue === "Enabled",
      switchboards.value.defaultSwitchboardIntegrationId
    );
  }
});

const fetchSwitchboardIntegrations = async () => {
  try {
    isLoading.value = true;
    const [sbintegrationsResponse, switchboardsResponse] = await Promise.all([
      fetch("/integrations/sbintegrations"),
      fetch("/integrations/switchboards"),
    ]);
    const sbintegrationsData = await sbintegrationsResponse.json();
    const switchboardsData = await switchboardsResponse.json();
    if (sbintegrationsData?.error || switchboardsData?.error) {
      throw new Error(sbintegrationsData.error || switchboardsData.error);
    }
    switchboardIntegrations.value = sbintegrationsData?.switchboardIntegrations;
    switchboards.value = switchboardsData?.switchboards[0];
    isSwitchboardEnabled.value = switchboardsData?.switchboards[0].enabled
      ? "Enabled"
      : "Disabled";
    defaultSwitchboardIntegrationIdSelected.value =
      switchboardsData?.switchboards[0].defaultSwitchboardIntegrationId;
    isLoading.value = false;
  } catch (error) {
    errorMessage.value = error.message;
    setTimeout(() => {
      router.go(-1);
    }, 2000);
  }
};

onBeforeMount(async () => {
  await fetchSwitchboardIntegrations();
});
</script>

<route lang="json">
{
  "name": "SunCo Switchboard Configuration",
  "meta": {
    "title": "SunCo Switchboard Configuration"
  }
}
</route>
