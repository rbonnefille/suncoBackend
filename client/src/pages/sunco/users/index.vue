<template>
  <div class="mt-4 container-md">
    <VLabel
      id="labelSearchUser"
      name="Search for a SunCo user"
      className="form-label" />
    <VInput
      id="searchUser"
      v-model="searchUser"
      name="Search User"
      class="mx-3"
      placeholder="user id or external id"
      @keyup.enter="searchUserSunCo">
      <template #end>
        <VButton text="Search User" type="button" @click="searchUserSunCo" />
      </template>
    </VInput>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import VInput from '@/components/VInput.vue';
  import VLabel from '@/components/VLabel.vue';
  import VButton from '@/components/VButton.vue';
  import { ref } from 'vue';

  const router = useRouter();
  const searchUser = ref('');

  const searchUserSunCo = async (e = undefined) => {
    const userId = searchUser.value || e.target.value;
    router.push({ name: 'SunCo User', params: { id: userId } });
  };
</script>

<route lang="json">
{
  "name": "Users",
  "meta": {
    "title": "Search User"
  }
}
</route>
