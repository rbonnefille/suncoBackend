<template>
  <div class="container mb-4">
    <div class="d-inline-block mb-2">
      <VSelect
        v-model="selected"
        label="Filter by snippet"
        option-hint="Select a spinnet"
        :options="filteredSnippets" />
    </div>
    <div class="d-inline-block mb-2">
      <label class="form-check-label mx-2">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="filterSuncoSnippets"
          @change="onFilterCheckboxChanged" />
        Sunco
      </label>
      <label class="form-check-label mx-2">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="filterZendeskSnippets"
          @change="onFilterCheckboxChanged" />
        Zendesk
      </label>
    </div>
    <div v-for="snippet in selectedSnippet" :key="snippet.id">
      <p class="lead">
        {{ snippet.description }}
      </p>
      <pre><code>{{ snippet.content }}<div v-if="isSupported"><button class="btn btn-secondary" @click='copySnippet(snippet)'><span v-if='!isCopied(snippet.id)'>Copy</span><span v-else>Copied!</span></button></div></code></pre>
    </div>
  </div>
</template>

<script setup>
  import { widgetSnippets } from '@/utils/widgetSnippets';
  import { useClipboard } from '@vueuse/core';
  import { ref, computed } from 'vue';
  import VSelect from '@/components/VSelect.vue';

  const selected = ref(widgetSnippets[0].id);
  const source = ref(null);
  const copiedSnippetId = ref(null);
  const filterSuncoSnippets = ref(true);
  const filterZendeskSnippets = ref(true);

  const { copy, copied, isSupported } = useClipboard({ source });

  const copySnippet = snippet => {
    copy(snippet.content);
    copiedSnippetId.value = snippet.id;
  };

  const isCopied = snippetId => {
    return copied && copiedSnippetId.value === snippetId;
  };

  const onFilterCheckboxChanged = () => {
    if (filteredSnippets.value && filteredSnippets.value.length > 0) {
      selected.value = filteredSnippets.value[0].id;
    } else {
      filteredSnippets.value.push({
        id: 'No snippets found',
        description: 'No snippets found',
        content: 'No snippets found',
        for: 'sunco',
      });
      selected.value = filteredSnippets.value[0].id;
    }
  };

  const filteredSnippets = computed(() => {
    return widgetSnippets.filter(snippet => {
      if (filterSuncoSnippets.value && filterZendeskSnippets.value) {
        return snippet;
      } else if (filterSuncoSnippets.value) {
        return snippet.for === 'sunco';
      } else if (filterZendeskSnippets.value) {
        return snippet.for === 'zendesk';
      }
    });
  });

  const selectedSnippet = computed(() => {
    if (selected.value) {
      return widgetSnippets.filter(snippet => snippet.id === selected.value);
    } else {
      return widgetSnippets;
    }
  });
</script>

<route lang="json">
{
  "name": "Widget Snippets",
  "meta": {
    "title": "Widget Snippets"
  }
}
</route>

<style lang="css" scoped>
  pre code {
    background-color: #fefaf2;
    border: 1px solid #999;
    border-radius: 8px;
    display: block;
    padding: 10px;
    position: relative;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
