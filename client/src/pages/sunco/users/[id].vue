<template>
  <div class="mb-4 container">
    <div v-if="errorMessage">
      <VError class="mt-2" :errorMessage="errorMessage" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <PulseLoader
        :loading="isLoading"
        :color="'#9a4497'"
        :size="`20px`"
      ></PulseLoader>
    </div>
    <div v-else>
      <h2 class="mt-3">User data</h2>
      <div class="row row-cols-2">
        <div class="col">
          <div class="card">
            <div class="card-header bg-body-secondary">User</div>
            <ul class="list-group list-group-flush">
              <VDataItem label="User id" :value="suncoUser.id" />
              <VDataItem label="External id" :value="suncoUser.externalId" />
              <VDataItem label="signedUpAt" :value="suncoUser.signedUpAt" />
              <ul class="list-group-item">
                profile:
                <template
                  v-for="(profile, key) in suncoUser.profile"
                  :key="profile.givenName"
                >
                  <VDataItem :label="key" :value="profile" />
                </template>
              </ul>
              <ul class="list-group-item">
                metadata:
                <template
                  v-for="(metadata, key) in suncoUser.metadata"
                  :key="key"
                >
                  <VDataItem :label="key" :value="metadata" />
                </template>
              </ul>
              <ul class="list-group-item">
                identities:
                <template v-for="identities in suncoUser.identities">
                  <template
                    v-for="(identity, identityKey) in identities"
                    :key="identity.value"
                  >
                    <VDataItem :label="identityKey" :value="identity" />
                  </template>
                </template>
              </ul>
            </ul>
          </div>
        </div>
        <div class="col">
          <div
            v-for="(clients, key) in suncoUserClients"
            :key="key"
            class="col"
          >
            <div class="card">
              <div class="card-header bg-body-secondary">
                <img
                  :src="
                    integrationIcons[clients.type] || integrationIcons.default
                  "
                  :alt="clients.type"
                  width="20"
                  height="20"
                  class="align-middle"
                />
                {{ clients.type }}
              </div>
              <ul class="list-group list-group-flush">
                <template v-for="(client, key) in clients" :key="key">
                  <VDataItem :label="key" :value="client" />
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h2 class="mt-3">Conversations</h2>
      <div class="row row-cols-4">
        <div
          v-for="(conversations, key) in conversationsByTime"
          :key="key"
          class="col"
        >
          <div class="card">
            <div class="card-header bg-body-secondary">Conversation</div>
            <ul class="list-group list-group-flush">
              <VDataItem label="id" :value="conversations.id" />
              <VDataItem
                label="type"
                :value="conversations.type"
                :class-name="[
                  {
                    'fs-7 fw-bold text-success':
                      conversations.type === 'sdkGroup',
                  },
                ]"
              />
              <VDataItem
                label="isDefault"
                :value="conversations.isDefault"
                :class-name="[
                  { 'fs-7 fw-bold text-success': conversations.isDefault },
                ]"
              />
              <template v-if="conversations.metadata">
                <ul class="list-group-item">
                  metadata:
                  <template
                    v-for="(metadata, metadataKey) in conversations.metadata"
                    :key="metadataKey"
                  >
                    <VDataItem :label="metadataKey" :value="metadata" />
                  </template>
                </ul>
              </template>
              <ul class="list-group-item">
                activeSwitchboardIntegration:
                <template
                  v-for="(
                    sbIntegration, sbIntegrationKey
                  ) in conversations.activeSwitchboardIntegration"
                  :key="sbIntegrationKey"
                >
                  <VDataItem :label="sbIntegrationKey" :value="sbIntegration" />
                </template>
              </ul>
              <VDataItem
                label="businessLastRead"
                :value="conversations.businessLastRead"
              />
              <VDataItem
                label="lastUpdatedAt"
                :value="conversations.lastUpdatedAt"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import VDataItem from '@/components/VDataItem.vue';
import VError from '@/components/VError.vue';
import { useRoute } from 'vue-router';
import { integrationIcons } from '@/utils/integrationIcons.js';

const route = useRoute();

const isLoading = ref(false);
const suncoUser = ref();
const suncoUserClients = ref();
const suncoUserConversations = ref();
const errorMessage = ref(null);

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

const fetchSunCoUser = async () => {
  try {
    isLoading.value = true;
    const userResponse = await fetch(`/users/${route.params.id}`);
    const userData = await userResponse.json();
    if (userData.error) {
      isLoading.value = false;
      throw new Error(userData.error);
    }
    suncoUser.value = userData.user;
    const [clientsResponse, conversationsResponse] = await Promise.all([
      fetch(`/users/${route.params.id}/clients`),
      fetch(`/users/${route.params.id}/conversations`),
    ]);

    const clientsData = await clientsResponse.json();
    const conversationsData = await conversationsResponse.json();

    if (clientsData.error || conversationsData.error) {
      isLoading.value = false;
      throw new Error(clientsData.error || conversationsData.error);
    }
    suncoUserClients.value = clientsData.clients;
    suncoUserConversations.value = conversationsData.conversations;
    isLoading.value = false;
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  }
};

onBeforeMount(async () => {
  await fetchSunCoUser();
});
</script>

<route lang="json">
{
  "name": "SunCo User",
  "meta": {
    "title": "SunCo User"
  }
}
</route>

<style lang="css">
.card {
  margin-top: 1rem;
}
</style>
