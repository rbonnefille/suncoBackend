<template>
  <div class="container">
    <div v-if="errorMessage">
      <VError :errorMessage="errorMessage" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <PulseLoader
        :loading="isLoading"
        color="#355E34"
        :size="`20px`"></PulseLoader>
    </div>
    <div v-else>
      <div class="row">
        <h3 class="h3">
          Switchboard Integrations
          <PulseLoader
            :loading="isLoadingSwitchboardIntegrationUpdate"
            color="#355E34"
            :size="`15px`"
            :style="{ display: 'inline-block' }"></PulseLoader>
        </h3>
        <div
          v-for="sbintegration in switchboardIntegrations"
          :key="sbintegration.id"
          class="col-md-3">
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
                  class="align-middle" />
                {{ sbintegration.name }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="sbintegration.id" />
              <VDataItem
                label="integrationId"
                :value="sbintegration.integrationId" />
              <div class="list-group-item">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="sbintegration.name"
                  v-model="sbintegration.deliverStandbyEvents"
                  @change="
                    handleIntegrationChange(
                      sbintegration.id,
                      sbintegration.nextSwitchboardIntegrationId,
                      sbintegration.messageHistoryCount,
                      sbintegration.deliverStandbyEvents,
                    )
                  " />
                <label class="form-check-label mx-2" :for="sbintegration.name"
                  >Deliver Standby Events</label
                >
              </div>
              <ul class="list-group-item">
                <VSelect
                  v-model="
                    selectedNextSwitchboardIntegrationId[sbintegration.id]
                  "
                  label="Change Next Switchboard Integration"
                  option-hint="Select an integration"
                  :options="filterOutCurrentIntegration(sbintegration.id)"
                  @update:modelValue="
                    handleIntegrationChange(
                      sbintegration.id,
                      $event,
                      sbintegration.messageHistoryCount,
                      sbintegration.deliverStandbyEvents,
                    )
                  "
                  class="mb-2" />
                <VButton
                  v-if="!!sbintegration.nextSwitchboardIntegrationId"
                  text="Set next to null"
                  type="submit"
                  @click="
                    handleIntegrationChange(
                      sbintegration.id,
                      null,
                      sbintegration.messageHistoryCount,
                      sbintegration.deliverStandbyEvents,
                    )
                  " />
              </ul>
              <ul class="list-group-item">
                <VSelect
                  v-model="sbintegration.messageHistoryCount"
                  label="messageHistoryCount"
                  :value="sbintegration.messageHistoryCount"
                  option-hint="Message count history number"
                  :options="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  @update:modelValue="
                    handleIntegrationChange(
                      sbintegration.id,
                      sbintegration.nextSwitchboardIntegrationId,
                      $event,
                      sbintegration.deliverStandbyEvents,
                    )
                  " />
              </ul>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-4 row">
        <h3 class="h3">
          Switchboards
          <PulseLoader
            :loading="isLoadingSwitchboardUpdate"
            color="#355E34"
            :size="`15px`"
            :style="{ display: 'inline-block' }"></PulseLoader>
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
                  :options="['Enabled', 'Disabled']" />
              </ul>
              <ul class="list-group-item">
                <VSelect
                  v-model="defaultSwitchboardIntegrationIdSelected"
                  label="Change default Switchboard Integration"
                  option-hint="Select an integration"
                  :options="switchboardIntegrations" />
              </ul>
            </ul>
          </div>
        </div>
        <div class="mt-4 mb-5 row">
          <h4
            class="h4 mb-2 collapsable"
            data-bs-toggle="collapse"
            href="#collapseNewSwitchboardIntegration"
            role="button"
            aria-expanded="false"
            aria-controls="collapseNewSwitchboardIntegration"
            @click="
              newSwitchboardIntegrationCollapsed =
                !newSwitchboardIntegrationCollapsed
            ">
            <span
              style="cursor: pointer"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Create New Switchboard Integration">
              Create New Switchboard Integration
              <ChevronDownIcon
                v-if="newSwitchboardIntegrationCollapsed"
                style="height: 24px; height: 24px" />
            </span>
          </h4>
          <div class="collapse" id="collapseNewSwitchboardIntegration">
            <form @submit.prevent="newSwitchboardIntegration">
              <div class="form-group mt-2">
                <label for="integrationName"
                  >Integration Name (must contain only alphanumeric characters
                  and "-", and "_")</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="integrationName"
                  v-model="integrationName" />
              </div>
              <div class="form-group mt-2">
                <label for="integrationId"
                  >Integration ID of your Webhook</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="integrationId"
                  v-model="integrationId" />
              </div>
              <div class="mt-2 form-check">
                <input
                  type="checkbox"
                  class="mr-2 form-check-input"
                  id="deliverStandbyEvents"
                  v-model="deliverStandbyEvents" />
                <label class="form-check-label" for="deliverStandbyEvents"
                  >Deliver Standby Events</label
                >
              </div>
              <div class="form-group mt-2">
                <VSelect
                  v-model="nextSwitchboardIntegrationId"
                  label="Next Switchboard Integration ID"
                  option-hint="Select an integration"
                  :options="switchboardIntegrations" />
              </div>
              <div class="form-group mt-2">
                <label for="messageHistoryCount">Message History Count</label>
                <input
                  type="number"
                  class="mb-2 form-control"
                  id="messageHistoryCount"
                  v-model="messageHistoryCount" />
                <VButton
                  :disabled="!isFormValid"
                  text="Create integration"
                  type="submit" />
              </div>
            </form>
          </div>
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
  import { ChevronDownIcon } from '@heroicons/vue/24/outline';
  import {
    isLoadingSwitchboardUpdate,
    isLoadingSwitchboardIntegrationUpdate,
    switchboardIntegrations,
    isLoading,
    errorMessage,
    selectedNextSwitchboardIntegrationId,
    isSwitchboardEnabled,
    defaultSwitchboardIntegrationIdSelected,
    switchboards,
    useUpdateSwitchboard,
    useUpdateSwitchboardIntegration,
    useFetchSwitchboardIntegrations,
    useCreateSwitchboardIntegration,
  } from '@/composables/useSunco.js';

  // Form fields
  const integrationName = ref('');
  const integrationId = ref('');
  const deliverStandbyEvents = ref(false);
  const nextSwitchboardIntegrationId = ref('');
  const messageHistoryCount = ref(10);
  const newSwitchboardIntegrationCollapsed = ref(true);

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
      useCreateSwitchboardIntegration(
        integrationNameTrimed.value,
        integrationId.value,
        deliverStandbyEvents.value,
        nextSwitchboardIntegrationId.value,
        messageHistoryCount.value,
      );
    }
  };

  const filterOutCurrentIntegration = sbintegrationId => {
    return switchboardIntegrations.value.filter(
      integration => integration.id !== sbintegrationId,
    );
  };

  const handleIntegrationChange = async (
    switchboardIntegrationId,
    nextSwitchboardIntegrationId,
    messageHistoryCount,
    deliverStandbyEvents,
  ) => {
    useUpdateSwitchboardIntegration(
      switchboardIntegrationId,
      nextSwitchboardIntegrationId,
      messageHistoryCount,
      deliverStandbyEvents,
    );
  };

  watch(defaultSwitchboardIntegrationIdSelected, (newValue, oldValue) => {
    if (oldValue !== null || undefined) {
      useUpdateSwitchboard(switchboards.value.enabled, newValue);
    }
  });

  watch(isSwitchboardEnabled, (newValue, oldValue) => {
    if (oldValue !== null || undefined) {
      useUpdateSwitchboard(
        newValue === 'Enabled',
        switchboards.value.defaultSwitchboardIntegrationId,
      );
    }
  });

  onBeforeMount(async () => {
    await useFetchSwitchboardIntegrations();
  });
</script>

<route lang="json">
{
  "name": "Switchboard Configuration",
  "meta": {
    "title": "Switchboard Configuration"
  }
}
</route>
