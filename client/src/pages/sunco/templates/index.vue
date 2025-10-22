<template>
  <div class="mb-4 container">
    <div v-if="errorMessage">
      <VError class="mt-2" :errorMessage="errorMessage" />
    </div>
    <div v-else-if="isLoading" class="text-center">
      <PulseLoader
        :loading="isLoading"
        color="#355E34"
        :size="`20px`"></PulseLoader>
    </div>
    <div v-else>
      <h2 class="mt-3">SunCo templates</h2>
      <div class="row row-cols-3">
        <template
          v-for="(template, key) in suncoTemplates"
          :key="suncoTemplates.id">
          <div class="col mt-2">
            <div class="card">
              <div class="card-header bg-body-secondary">
                {{ template.name }}
              </div>
              <ul class="list-group list-group-flush">
                <VDataItem label="template id" :value="template._id" />
                <VDataItem label="message" :value="template.message" />
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import VDataItem from '@/components/VDataItem.vue';
  import VError from '@/components/VError.vue';

  const suncoTemplates = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref(null);

  const fetchTemplates = async () => {
    try {
      isLoading.value = true;
      const response = await fetch('/templates');
      const templates = await response.json();
      if (templates.error) {
        isLoading.value = false;
        throw new Error(templates.error);
      }
      suncoTemplates.value = templates;
      isLoading.value = false;
    } catch (error) {
      errorMessage.value = error.message;
      console.error(error);
    }
  };

  onBeforeMount(async () => {
    await fetchTemplates();
  });
</script>

<route lang="json">
{
  "name": "SunCo templates",
  "meta": {
    "title": "SunCo templates"
  }
}
</route>
