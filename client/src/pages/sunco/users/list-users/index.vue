<template>
  <div class="mt-4 container-md">
    <VLabel
      id="labelSearchUser"
      name="Search by email identity"
      className="form-label" />
    <VInput
      id="searchUser"
      v-model="searchUser"
      name="Search User"
      class="mx-3"
      placeholder="janedoe@example.com"
      @keyup.enter="searchUserSunCo">
      <template #end>
        <VButton text="Search User" type="button" @click="searchUserSunCo" />
      </template>
    </VInput>
    <div v-if="userIdentity">
      <div class="row mt-2 row-cols-2 d-flex flex-column align-items-center">
        <div class="col">
          <div class="card">
            <div class="card-header bg-body-secondary fw-bold">
              User Details
            </div>
            <ul class="list-group list-group-flush">
              <template
                v-for="(identity, identityKey) in userIdentity"
                :key="identity.value">
                <VDataItem :label="identityKey" :value="identity" />
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import VInput from '@/components/VInput.vue';
  import VLabel from '@/components/VLabel.vue';
  import VButton from '@/components/VButton.vue';
  import VDataItem from '@/components/VDataItem.vue';
  import { ref } from 'vue';
  import {
    useFetchUserIdentity,
    userIdentity,
  } from '@/composables/useSunco.js';

  const router = useRouter();
  const searchUser = ref('');

  const searchUserSunCo = async (e = undefined) => {
    const userEmail = searchUser.value || e.target.value;
    await useFetchUserIdentity(userEmail);
  };
</script>

<route lang="json">
{
  "name": "Find user by email identity",
  "meta": {
    "title": "Find user by email identity"
  }
}
</route>
