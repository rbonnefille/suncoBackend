<template>
  <h4 class="mt-4">SunCo Web</h4>
  <VButtonGroup
    label="SunCo Actions"
    :buttons="suncoButtons"
    className="widgetBtn" />

  <h4 class="mt-4">Zendesk Web</h4>
  <VButtonGroup
    label="Zendesk Actions"
    :buttons="zendeskButtons"
    className="widgetBtn" />
  <VSelect
    optionHint="Change Cookie Consent"
    v-model="cookieConsent.selected"
    :options="cookieConsent.options"
    @update:modelValue="updateCookieConsent"
    class="w-auto d-inline-flex mt-2 rounded-4 mx-2" />

  <VSelect
    optionHint="Select locale"
    v-model="locales.selected"
    :options="locales.options"
    @update:modelValue="updateWidgetLocale"
    class="w-auto d-inline-flex mt-2 rounded-4 mx-2" />

  <h4 class="mt-2">Tools</h4>
  <VButtonGroup
    label="Tools Actions"
    :buttons="toolsButtons"
    className="toolsBtn" />
  <VMetadataDisplay
    v-if="metadataSet"
    :metadataCode="zendeskButtons.setMetadata.code" />
  <VMetadataDisplay
    v-else-if="customerMetadataSet"
    :metadataCode="zendeskButtons.setCustomerMetadata.code" />
  <VSidebar ref="sidebarRef">
    <template #title>Embedded mode</template>
    <template #default>
      <div id="messenger-widget" style="width: 100%; height: 100%"></div>
    </template>
  </VSidebar>
</template>

<script setup>
  import VSelect from '@/components/VSelect.vue';
  import VSidebar from '@/components/VSidebar.vue';
  import VButtonGroup from '@/components/VButtonGroup.vue';
  import VMetadataDisplay from '@/components/VMetadataDisplay.vue';
  import { reactive } from 'vue';
  import {
    toolsButtons,
    suncoButtons,
    zendeskButtons,
    updateWidgetLocale,
    updateCookieConsent,
    metadataSet,
    customerMetadataSet,
    sidebarRef,
  } from '@/composables/useWidgetButtons';

  const locales = reactive({
    selected: 'en',
    options: ['en', 'fr', 'de', 'es', 'nl'],
  });

  const cookieConsent = reactive({
    selected: 'all',
    options: ['all', 'none', 'functional'],
  });
</script>
