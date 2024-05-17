<template>
  <div class="container mb-4">
    <div class="d-inline-block mb-2">
      <VSelect
        v-model="selected"
        label="Filter by snippet"
        option-hint="Select a spinnet"
        :options="snippets"
      />
    </div>
    <div v-for="snippet in filteredSnippets" :key="snippet.id">
      <p class="lead">
        {{ snippet.description }}
      </p>
      <pre><code>{{ snippet.content }}<div v-if="isSupported"><button class="btn btn-secondary" @click='copySnippet(snippet)'><span v-if='!isCopied(snippet.id)'>Copy</span><span v-else>Copied!</span></button></div></code></pre>
    </div>
  </div>
</template>

<script setup>
import { snippets } from "@/utils/snippets";
import { useClipboard } from "@vueuse/core";
import { ref, computed } from "vue";
import VSelect from "@/components/VSelect.vue";

const selected = ref(snippets[0].id);
const source = ref(null);
const copiedSnippetId = ref(null);

const { copy, copied, isSupported } = useClipboard({ source });

const copySnippet = (snippet) => {
  copy(snippet.content);
  copiedSnippetId.value = snippet.id;
};

const isCopied = (snippetId) => {
  return copied && copiedSnippetId.value === snippetId;
};

const filteredSnippets = computed(() => {
  if (selected.value) {
    return snippets.filter((snippet) => snippet.id === selected.value);
  } else {
    return snippets;
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
