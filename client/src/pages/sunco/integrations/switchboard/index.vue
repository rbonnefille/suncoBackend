<template>
  <div class="container">
    <div v-if="errorMessage">
      <VError :errorMessage="errorMessage" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <PulseLoader
        :loading="isLoading"
        :color="'#9a4497'"
        :size="`20px`"
      ></PulseLoader>
    </div>
    <div v-else>
      <div class="row">
        <h3 class="h3 mb-2">
          Switchboard Integrations
          <PulseLoader
            :loading="isLoadingSwitchboardIntegrationUpdate"
            :color="'#9a4497'"
            :size="`15px`"
            :style="{ display: 'inline-block' }"
          ></PulseLoader>
        </h3>
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
              <ul
                v-if="sbintegration.nextSwitchboardIntegrationId"
                class="list-group-item"
              >
                <VSelect
                  v-model="selectedIntegrationId[sbintegration.id]"
                  label="Change Next Switchboard Integration"
                  option-hint="Select an integration"
                  :options="filterOutCurrentIntegration(sbintegration.id)"
                  @update:modelValue="
                    handleIntegrationChange(sbintegration.id, $event)
                  "
                />
              </ul>
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
          Switchboards
          <PulseLoader
            :loading="isLoadingSwitchboardUpdate"
            :color="'#9a4497'"
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
        <div class="mt-5 mb-4 row">
          <h3 class="h3 mb-2">Create New Switchboard Integration</h3>
          <form @submit.prevent="newSwitchboardIntegration">
            <div class="form-group mt-2">
              <label for="integrationName"
                >Integration Name (must contain only alphanumeric characters and
                "-", and "_")</label
              >
              <input
                type="text"
                class="form-control"
                id="integrationName"
                v-model="integrationName"
              />
            </div>
            <div class="form-group mt-2">
              <label for="integrationId">Integration ID of your Webhook</label>
              <input
                type="text"
                class="form-control"
                id="integrationId"
                v-model="integrationId"
              />
            </div>
            <div class="mt-2 form-check">
              <input
                type="checkbox"
                class="mr-2 form-check-input"
                id="deliverStandbyEvents"
                v-model="deliverStandbyEvents"
              />
              <label class="form-check-label" for="deliverStandbyEvents"
                >Deliver Standby Events</label
              >
            </div>
            <div class="form-group mt-2">
              <VSelect
                v-model="nextSwitchboardIntegrationId"
                label="Next Switchboard Integration ID"
                option-hint="Select an integration"
                :options="switchboardIntegrations"
              />
            </div>
            <div class="form-group mt-2">
              <label for="messageHistoryCount">Message History Count</label>
              <input
                type="number"
                class="form-control"
                id="messageHistoryCount"
                v-model="messageHistoryCount"
              />
              <VButton
                class="mt-2"
                :disabled="!isFormValid"
                :button="nextSwitchboardBtn"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { integrationIcons } from '@/utils/integrationIcons.js';
import VDataItem from '@/components/VDataItem.vue';
import VSelect from '@/components/VSelect.vue';
import VButton from '@/components/VButton.vue';
import VError from '@/components/VError.vue';
import {
  isLoadingSwitchboardUpdate,
  isLoadingSwitchboardIntegrationUpdate,
  switchboardIntegrations,
  isLoading,
  errorMessage,
  selectedIntegrationId,
  isSwitchboardEnabled,
  defaultSwitchboardIntegrationIdSelected,
  switchboards,
  updateSwitchboard,
  updateSwitchboardIntegration,
  fetchSwitchboardIntegrations,
  createSwitchboardIntegration,
} from '@/utils/sunco.js';

const nextSwitchboardBtn = {
  btnText: 'Create integration',
  btnType: 'submit',
};

// Form fields
let integrationName = ref('');
let integrationId = ref('');
let deliverStandbyEvents = ref(false);
let nextSwitchboardIntegrationId = ref('');
let messageHistoryCount = ref(10);

const integrationNameTrimed = computed(() => {
  return integrationName.value.trim().replace(/\s+/g, '-');
});

// Computed property to check if all form fields are filled
const isFormValid = computed(() => {
  return (
    integrationNameTrimed.value !== '' &&
    integrationId.value.trim() !== '' &&
    nextSwitchboardIntegrationId.value.trim() !== ''
  );
});

// Function to handle the form submission
const newSwitchboardIntegration = () => {
  if (isFormValid) {
    createSwitchboardIntegration(
      integrationNameTrimed.value,
      integrationId.value,
      deliverStandbyEvents.value,
      nextSwitchboardIntegrationId.value,
      messageHistoryCount.value
    );
  }
};

const filterOutCurrentIntegration = (sbintegrationId) => {
  return switchboardIntegrations.value.filter(
    (integration) => integration.id !== sbintegrationId
  );
};

const handleIntegrationChange = async (
  sbintegrationId,
  nextSwitchboardIntegrationId
) => {
  updateSwitchboardIntegration(sbintegrationId, nextSwitchboardIntegrationId);
};

watch(defaultSwitchboardIntegrationIdSelected, (newValue, oldValue) => {
  if (oldValue !== null || undefined) {
    updateSwitchboard(switchboards.value.enabled, newValue);
  }
});

watch(isSwitchboardEnabled, (newValue, oldValue) => {
  if (oldValue !== null || undefined) {
    updateSwitchboard(
      newValue === 'Enabled',
      switchboards.value.defaultSwitchboardIntegrationId
    );
  }
});

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
