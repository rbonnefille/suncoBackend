<template>
  <div class="mt-4 container">
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
        <div
          v-for="integration in integrationsByType"
          :key="integration.id"
          class="col-md-3">
          <div class="card m-2">
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
                  class="align-middle" />
                {{
                  integration.displayName ? integration.displayName : 'custom'
                }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="integration.id" />
              <VDataItem
                label="status"
                :value="
                  integration.status === 'active' ? '✅' : integration.status
                " />
              <template v-if="integration.defaultResponder">
                <ul class="list-group-item">
                  Per-channel responder:
                  <VDataItem
                    :loading="isLoading"
                    label="id"
                    :value="integration?.defaultResponder.id" />
                  <ul class="list-group-item">
                    <VSelect
                      v-model="integration.defaultResponder.id"
                      label="Change defaultResponder"
                      option-hint="Select an integration"
                      :options="switchboardIntegrations"
                      @update:modelValue="
                        handleIntegrationChange(
                          integration.id,
                          undefined,
                          undefined,
                          $event,
                        )
                      "
                      class="mb-2" />
                    <VButton
                      v-if="!integration.defaultResponder.inherited"
                      text="Set inherited back to true"
                      type="submit"
                      @click="
                        handleIntegrationChange(
                          integration.id,
                          undefined,
                          undefined,
                          null,
                        )
                      " />
                  </ul>
                  <VDataItem
                    :loading="isLoading"
                    label="integrationId"
                    :value="integration?.defaultResponder.integrationId" />
                  <VDataItem
                    :loading="isLoading"
                    label="integrationType"
                    :value="integration?.defaultResponder.integrationType" />
                  <VDataItem
                    :loading="isLoading"
                    label="deliverStandbyEvents"
                    :value="
                      integration?.defaultResponder.deliverStandbyEvents
                    " />
                  <VDataItem
                    :loading="isLoading"
                    label="nextSwitchboardIntegrationId"
                    :value="
                      integration?.defaultResponder.nextSwitchboardIntegrationId
                    " />
                  <VDataItem
                    :loading="isLoading"
                    label="messageHistoryCount"
                    :value="
                      integration?.defaultResponder.messageHistoryCount
                    " />
                  <VDataItem
                    :loading="isLoading"
                    label="inherited"
                    :value="integration?.defaultResponder.inherited" />
                </ul>
              </template>
              <VDataItem
                v-if="integration.brandId"
                :loading="isLoading"
                label="brandId"
                :value="integration.brandId" />
              <div
                v-if="integration.canUserCreateMoreConversations !== undefined"
                class="list-group-item">
                <span class="d-flex align-items-center text-break">
                  <input
                    :id="'canUserCreateMoreConversations-' + integration.id"
                    class="form-check-input"
                    type="checkbox"
                    v-model="integration.canUserCreateMoreConversations"
                    @change="
                      handleIntegrationChange(
                        integration.id,
                        integration.canUserCreateMoreConversations,
                        integration.canUserSeeConversationList,
                      )
                    " />
                  <label
                    id="canUserCreateMoreConversations"
                    class="form-check-label mx-2"
                    :for="'canUserCreateMoreConversations-' + integration.id"
                    ><code>canUserCreateMoreConversations</code></label
                  >
                </span>
              </div>
              <div
                v-if="integration.canUserSeeConversationList !== undefined"
                class="list-group-item">
                <span class="d-flex align-items-center text-break">
                  <input
                    :id="'canUserSeeConversationList-' + integration.id"
                    class="form-check-input"
                    type="checkbox"
                    v-model="integration.canUserSeeConversationList"
                    @change="
                      handleIntegrationChange(
                        integration.id,
                        integration.canUserCreateMoreConversations,
                        integration.canUserSeeConversationList,
                      )
                    " />
                  <label
                    class="form-check-label mx-2"
                    :for="'canUserSeeConversationList-' + integration.id"
                    ><code>canUserSeeConversationList</code></label
                  >
                </span>
              </div>
              <template v-if="integration.type === 'whatsapp'">
                <VDataItem
                  :loading="isLoading"
                  label="accountId"
                  :value="integration.accountId" />
                <VDataItem
                  :loading="isLoading"
                  label="businessManagerId"
                  :value="integration.businessManagerId" />
                <VDataItem
                  :loading="isLoading"
                  label="appId"
                  :value="integration.appId" />
                <VDataItem
                  :loading="isLoading"
                  label="phoneNumber"
                  :value="integration.phoneNumber" />
                <VDataItem
                  :loading="isLoading"
                  label="phoneNumberId"
                  :value="integration.phoneNumberId" />
              </template>
              <template v-if="integration.type === 'custom'">
                <VDataItem
                  :loading="isLoading"
                  label="target"
                  :value="integration.webhooks[0]?.target" />
                <ul class="list-group-item">
                  Webhook Triggers:
                  <template
                    v-for="(trigger, key) in integration?.webhooks[0]?.triggers"
                    :key="key">
                    <VDataItem :loading="isLoading" :value="trigger" />
                  </template>
                </ul>
                <VDataItem
                  :loading="isLoading"
                  label="includeFullSource"
                  :value="integration.webhooks[0]?.includeFullSource" />
                <VDataItem
                  :loading="isLoading"
                  label="includeFullUser"
                  :value="integration.webhooks[0]?.includeFullUser" />
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeMount, computed } from 'vue';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import { integrationIcons } from '@/utils/integrationIcons.js';
  import VDataItem from '@/components/VDataItem.vue';
  import VError from '@/components/VError.vue';
  import VSelect from '@/components/VSelect.vue';
  import VButton from '@/components/VButton.vue';
  import {
    isLoading,
    integrations,
    useFetchIntegrations,
    errorMessage,
    useUpdateIntegration,
    switchboardIntegrations,
    useFetchSwitchboardIntegrations,
  } from '@/composables/useSunco.js';

  const integrationsByType = computed(() => {
    const order = [
      'web',
      'ios',
      'android',
      'whatsapp',
      'instagram',
      'messenger',
      'line',
      'twilio',
      'telegram',
      'slackconnect',
      'custom',
    ];
    const integrationsArray = integrations.value || [];
    return integrationsArray.slice(0).sort((a, b) => {
      const indexA = order.indexOf(a.type);
      const indexB = order.indexOf(b.type);
      if (indexA === -1 && indexB === -1) {
        return 0;
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    });
  });

  onBeforeMount(async () => {
    await useFetchSwitchboardIntegrations();
    await useFetchIntegrations();
  });

  const handleIntegrationChange = async (
    integrationId,
    canUserCreateMoreConversations,
    canUserSeeConversationList,
    defaultResponder,
  ) => {
    useUpdateIntegration(
      integrationId,
      canUserCreateMoreConversations,
      canUserSeeConversationList,
      defaultResponder,
    );
  };
</script>

<route lang="json">
{
  "name": "Messaging Integrations",
  "meta": {
    "title": "Messaging Integrations"
  }
}
</route>
