<template>
  <div class="mb-4 container">
    <h2 class="mt-3">User data</h2>
    <div v-if="errorMessage">
      <VError class="mt-2" :errorMessage="errorMessage" />
    </div>
    <div v-else>
      <div class="row row-cols-2">
        <div class="col">
          <div class="card">
            <div class="card-header bg-body-secondary fw-bold">User</div>
            <ul class="list-group list-group-flush">
              <VDataItem v-if="suncoUser?.id" :loading="isLoading" label="id" :value="suncoUser?.id" />
              <VDataItem v-if="suncoUser?.externalId" :loading="isLoading" label="External id"
                :value="suncoUser?.externalId" />
              <VDataItem v-if="suncoUser?.zendeskId" :loading="isLoading" label="zendeskId"
                :value="suncoUser?.zendeskId" />
              <VDataItem v-if="suncoUser?.signedUpAt" :loading="isLoading" label="signedUpAt"
                :value="suncoUser?.signedUpAt" />
              <VDataItem v-if="suncoUser?.toBeRetained" :loading="isLoading" label="toBeRetained"
                :value="suncoUser?.toBeRetained" />
              <VDataItem :loading="isLoading" label="authenticated" :value="suncoUser?.authenticated" />
              <ul v-if="suncoUser?.profile.length > 0" class="list-group-item">
                profile:
                <template v-if="isLoading">
                  <VSkeleton v-for="n in 3" :key="n" :loading="isLoading" />
                </template>
                <template v-else>
                  <template v-for="(profile, key) in suncoUser?.profile" :key="key">
                    <VDataItem :label="key" :value="profile" />
                  </template>
                </template>
              </ul>
              <ul v-if="suncoUser?.metadata" class="list-group-item">
                metadata:
                <template v-if="isLoading">
                  <VSkeleton v-for="n in 3" :key="n" :loading="isLoading" />
                </template>
                <template v-else>
                  <template v-for="(metadata, key) in suncoUser?.metadata" :key="key">
                    <VDataItem :label="key" :value="metadata" />
                  </template>
                </template>
              </ul>
              <ul v-if="suncoUser?.identities.length > 0" class="list-group-item">
                identities:
                <template v-if="isLoading">
                  <VSkeleton v-for="n in 3" :key="n" :loading="isLoading" />
                </template>
                <template v-else>
                  <template v-for="(identities, index) in suncoUser?.identities" :key="index">
                    <template v-for="(identity, identityKey) in identities" :key="identity.value">
                      <VDataItem :label="identityKey" :value="identity" />
                    </template>
                  </template>
                </template>
              </ul>
            </ul>
          </div>
        </div>
        <div class="col">
          <template v-if="!suncoUserClients">
            <div class="card">
              <div class="card-header bg-body-secondary fw-bold">Clients</div>
              <template v-if="isLoading">
                <ul class="list-group list-group-flush">
                  <VSkeleton v-for="n in 3" :key="n" :loading="isLoading" />
                </ul>
              </template>
            </div>
          </template>
          <template v-else>
            <div v-for="(clients, key) in suncoUserClients" :key="key" class="col">
              <div class="card">
                <div class="card-header bg-body-secondary fw-bold">
                  <span>
                    <img :src="integrationIcons[clients.type] ||
                      integrationIcons.default
                      " :alt="clients.type" width="20" height="20" class="align-middle" />
                  </span>
                  {{ clients.type }} client
                </div>
                <ul class="list-group list-group-flush">
                  <template v-for="(client, key) in clients" :key="key">
                    <VDataItem :loading="isLoading" :label="key" :value="client" />
                  </template>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template v-if="suncoUserDevices?.length > 0">
      <h2 class="mt-3 collapsable" data-bs-toggle="collapse" href="#collapseDevices" role="button" aria-expanded="false"
        aria-controls="collapseDevices" @click="devicesCollapsed = !devicesCollapsed">
        <span style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="Devices">
          {{ suncoUserDevices?.length }} Devices
          <ChevronDownIcon v-if="devicesCollapsed" style="height: 24px; height: 24px" />
        </span>
      </h2>
      <div class="row row-cols-4 collapse" id="collapseDevices">
        <template v-for="(device, key) in suncoUserDevices" :key="key">
          <div class="col">
            <div class="card">
              <div class="card-header bg-body-secondary fw-bold">
                Device {{ key }}
              </div>
              <ul class="list-group list-group-flush">
                <VDataItem :loading="isLoading" label="device id" :value="device?.id" />
                <VDataItem :loading="isLoading" label="guid" :value="device?.guid" />
                <VDataItem :loading="isLoading" label="clientId" :value="device?.clientId" />
                <VDataItem :loading="isLoading" label="integrationId" :value="device?.integrationId" />
                <VDataItem :loading="isLoading" label="type" :value="device?.type" />
                <VDataItem :loading="isLoading" label="status" :value="device?.status" />
                <ul class="list-group-item">
                  info:
                  <template v-for="(info, key) in device?.info" :key="key">
                    <VDataItem :loading="isLoading" :label="key" :value="info" />
                  </template>
                </ul>
                <VDataItem :loading="isLoading" label="lastSeen" :value="device?.lastSeen" />
              </ul>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-if="suncoUserConversations?.length > 0">
      <h2 class="mt-3 collapsable" data-bs-toggle="collapse" href="#collapseConversations" role="button"
        aria-expanded="false" aria-controls="collapseConversations"
        @click="conversationsCollapsed = !conversationsCollapsed">
        <span style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="Conversations">
          {{ conversationsByTime?.length }} Conversations
          <ChevronDownIcon v-if="conversationsCollapsed" style="height: 24px; height: 24px" />
        </span>
      </h2>
      <VButton v-if="suncoUserConversations?.length >= 2" @click="deleteConversations" type="button"
        class="btn btn-danger" text="Delete all conversations not associated with a ticket" />
      <div class="row row-cols-4 collapse" id="collapseConversations">
        <div v-for="(conversation, key) in conversationsByTime" :key="key" class="col">
          <div v-if="conversation" class="card">
            <div class="card-header bg-body-secondary fw-bold">
              <VDataItem :loading="isLoading" label="id" :value="conversation.id" />
            </div>
            <ul class="list-group list-group-flush">
              <VDataItem :loading="isLoading" label="type" :value="conversation.type" :class-name="[
                {
                  'fs-7 fw-bold text-success':
                    conversation.type === 'sdkGroup',
                },
              ]" />
              <VDataItem :loading="isLoading" label="isDefault" :value="conversation.isDefault" :class-name="[
                { 'fs-7 fw-bold text-success': conversation.isDefault },
              ]" />
              <VDataItem v-if="conversation.brandId" :loading="isLoading" label="brandId"
                :value="conversation.brandId" />
              <template v-if="conversation.metadata">
                <ul class="list-group-item">
                  metadata:
                  <template v-for="(metadata, metadataKey) in conversation.metadata" :key="metadataKey">
                    <VDataItem :loading="isLoading" :label="metadataKey" :value="metadata" />
                  </template>
                </ul>
              </template>
              <ul v-if="conversation.activeSwitchboardIntegration" class="list-group-item">
                activeSwitchboardIntegration:
                <template v-for="(
sbIntegration, sbIntegrationKey
                  ) in conversation.activeSwitchboardIntegration" :key="sbIntegrationKey">
                  <VDataItem :loading="isLoading" :label="sbIntegrationKey" :value="sbIntegration" />
                </template>
              </ul>
              <VDataItem :loading="isLoading" label="businessLastRead" :value="conversation.businessLastRead" />
              <VDataItem :loading="isLoading" label="lastUpdatedAt" :value="conversation.lastUpdatedAt" />
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import VDataItem from '@/components/VDataItem.vue';
import VError from '@/components/VError.vue';
import VButton from '@/components/VButton.vue';
import VSkeleton from '@/components/VSkeleton.vue';
import { integrationIcons } from '@/utils/integrationIcons.js';
import { useRoute } from 'vue-router';

import {
  isLoading,
  suncoUser,
  suncoUserClients,
  suncoUserConversations,
  suncoUserDevices,
  useFetchSunCoUser,
  useDeleteConversations,
  errorMessage,
} from '@/composables/useSunco.js';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const route = useRoute();

const devicesCollapsed = ref(true);
const conversationsCollapsed = ref(true);

const deleteConversations = () => {
  try {
    useDeleteConversations(route.params.id);
  } catch (error) {
    console.error(error);
  }
};

const conversationsByTime = computed(() => {
  return suncoUserConversations.value?.slice(0).sort((a, b) => {
    if (a.lastUpdatedAt > b.lastUpdatedAt) {
      return -1;
    }
    if (a.lastUpdatedAt < b.lastUpdatedAt) {
      return 1;
    }
    return 0;
  });
});

onBeforeMount(async () => {
  await useFetchSunCoUser(route.params.id);
});
</script>

<route lang="json">{
  "name": "SunCo User",
  "meta": {
    "title": "SunCo User"
  }
}</route>
