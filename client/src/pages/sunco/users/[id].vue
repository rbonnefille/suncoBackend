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
            <div class="card-header bg-body-secondary">User</div>
            <ul class="list-group list-group-flush">
              <VDataItem :loading="isLoading" label="User id" :value="suncoUser?.id" />
              <VDataItem :loading="isLoading" label="External id" :value="suncoUser?.externalId" />
              <VDataItem :loading="isLoading" label="signedUpAt" :value="suncoUser?.signedUpAt" />
              <ul class="list-group-item">
                profile:
                <template v-for="(profile, key) in suncoUser?.profile" :key="profile?.givenName">
                  <VDataItem :loading="isLoading" :label="key" :value="profile" />
                </template>
              </ul>
              <ul class="list-group-item">
                metadata:
                <template v-for="(metadata, key) in suncoUser?.metadata" :key="key">
                  <VDataItem :loading="isLoading" :label="key" :value="metadata" />
                </template>
              </ul>
              <ul class="list-group-item">
                identities:
                <template v-for="identities in suncoUser.identities">
                  <template v-for="(identity, identityKey) in identities" :key="identity.value">
                    <VDataItem :loading="isLoading" :label="identityKey" :value="identity" />
                  </template>
                </template>
              </ul>
            </ul>
          </div>
        </div>
        <div class="col">
          <div v-for="(clients, key) in suncoUserClients" :key="key" class="col">
            <div class="card">
              <div class="card-header bg-body-secondary"><span>
                  <img :src="integrationIcons[clients.type] ||
      integrationIcons.default
      " :alt="clients.type" width="20" height="20" class="align-middle" />
                </span> {{ clients.type }} client </div>
              <ul class="list-group list-group-flush">
                <template v-for="(client, key) in clients" :key="key">
                  <VDataItem :loading="isLoading" :label="key" :value="client" />
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-cols-4">
      <template v-for="(device, key) in suncoUserDevices" :key="key">
        <div class="col">
          <div class="card">
            <div class="card-header bg-body-secondary">Device {{ key }}</div>
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
    <h2 class="mt-3">Conversations</h2>
    <div class="row row-cols-4">
      <div v-for="(conversations, key) in conversationsByTime" :key="key" class="col">
        <div v-if="conversations" class="card">
          <div class="card-header bg-body-secondary">Conversation</div>
          <ul class="list-group list-group-flush">
            <VDataItem :loading="isLoading" label="id" :value="conversations.id" />
            <VDataItem :loading="isLoading" label="type" :value="conversations.type" :class-name="[
      {
        'fs-7 fw-bold text-success':
          conversations.type === 'sdkGroup',
      },
    ]" />
            <VDataItem :loading="isLoading" label="isDefault" :value="conversations.isDefault" :class-name="[
      { 'fs-7 fw-bold text-success': conversations.isDefault },
    ]" />
            <template v-if="conversations.metadata">
              <ul class="list-group-item">
                metadata:
                <template v-for="(metadata, metadataKey) in conversations.metadata" :key="metadataKey">
                  <VDataItem :loading="isLoading" :label="metadataKey" :value="metadata" />
                </template>
              </ul>
            </template>
            <ul class="list-group-item">
              activeSwitchboardIntegration:
              <template v-for="(
                    sbIntegration, sbIntegrationKey
                  ) in conversations.activeSwitchboardIntegration" :key="sbIntegrationKey">
                <VDataItem :loading="isLoading" :label="sbIntegrationKey" :value="sbIntegration" />
              </template>
            </ul>
            <VDataItem :loading="isLoading" label="businessLastRead" :value="conversations.businessLastRead" />
            <VDataItem :loading="isLoading" label="lastUpdatedAt" :value="conversations.lastUpdatedAt" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import VDataItem from "@/components/VDataItem.vue";
import VError from "@/components/VError.vue";
import { integrationIcons } from "@/utils/integrationIcons.js";
import { useRoute } from "vue-router";
import {
  isLoading,
  suncoUser,
  suncoUserClients,
  suncoUserConversations,
  suncoUserDevices,
  fetchSunCoUser,
  errorMessage,
} from "@/utils/sunco.js";

const route = useRoute();

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
  await fetchSunCoUser(route.params.id);
});
</script>

<route lang="json">{
  "name": "SunCo User",
  "meta": {
    "title": "SunCo User"
  }
}</route>

<style lang="css">
.card {
  margin-top: 1rem;
}
</style>
