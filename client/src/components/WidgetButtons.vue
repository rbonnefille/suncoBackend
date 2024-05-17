<template>
  <h4 class="mt-4">SunCo Web</h4>
  <div class="col-auto" role="group" aria-label="Actions">
    <VButton v-for="(button, key) in suncoButtons" v-once :key="key" :text="button.text" :type="button.type"
      @click="button.click" />
  </div>
  <h4 class="mt-4">Zendesk Web</h4>
  <div class="col-auto" role="group" aria-label="Actions">
    <VButton v-for="(button, key) in zendeskButtons" v-once :key="key" :text="button.text" :type="button.type"
      @click="button.click" />
    <VSelect optionHint="Select locale" v-model="locale" :options="['en', 'fr', 'de', 'es']"
      @update:modelValue="updateWidgetLocale" class="w-auto d-inline-flex rounded-4" />
  </div>
  <h4 class="mt-2">Tools</h4>
  <div class="col-auto" role="group" aria-label="Actions">
    <VButton v-for="(button, key) in toolsButtons" v-once :key="key" :text="button.text" :type="button.type"
      @click="button.click" />
  </div>
  <div v-if="metadataSet">
    <h4 class="mt-5">Metadata were set with</h4>
    <div>
      <code>window.zE('messenger:set', 'conversationFields', [{ id: 17826865089553,
        value: 'test'}])</code>
    </div>
    <div>
      <code>window.zE('messenger:set', 'conversationTags', ["sales",
        "computer_accessories"]);</code>
    </div>
  </div>
</template>

<script setup>
import VButton from "@/components/VButton.vue";
import VSelect from "@/components/VSelect.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/store";
import { clearBrowserStorage, getRandomImageUrl } from "@/utils/helpers.js";

const userStore = useUserStore();
const { changeAuthenticationStatus, loginWidgets } = userStore;
const metadataSet = ref(false);
const locale = ref("");
const updateWidgetLocale = () => {
  window.zE(
    "messenger:set", "locale", `${locale.value}`
  );
};
const toolsButtons = {
  clearStorage: {
    text: "Clear Storage",
    type: "button",
    click() {
      clearBrowserStorage();
    },
  },
};
const suncoButtons = {
  openSunCo: {
    text: "Open",
    type: "button",
    click() {
      window.Smooch.open();
    },
  },
  closeSunCo: {
    text: "Close",
    type: "button",
    click() {
      window.Smooch.close();
    },
  },
  loginSunco: {
    text: "Login",
    type: "button",
    click() {
      loginWidgets("sunco");
    },
  },
  logoutSunco: {
    text: "Logout",
    type: "button",
    click() {
      window.Smooch.logout();
      window.Smooch.close();
      userStore.$reset();
      changeAuthenticationStatus(false);
    },
  },
  sendImage: {
    text: "Send Image",
    type: "button",
    click() {
      window.Smooch.sendMessage(
        {
          type: "image",
          mediaUrl: getRandomImageUrl(),
        },
        Smooch.getDisplayedConversation().id,
      );
    },
  },
  docs: {
    text: "Dev Docs",
    type: "button",
    click() {
      window.open(
        "https://github.com/zendesk/sunshine-conversations-web",
        "_blank",
      );
    },
  },
};

const zendeskButtons = {
  openMessaging: {
    text: "Open",
    type: "button",
    click() {
      window.zE("messenger", "open");
    },
  },
  closeMessaging: {
    text: "Close",
    type: "button",
    click() {
      window.zE("messenger", "close");
    },
  },
  showMessaging: {
    text: "Show",
    type: "button",
    click() {
      window.zE("messenger", "show");
    },
  },
  hideMessaging: {
    text: "Hide",
    type: "button",
    click() {
      window.zE("messenger", "hide");
    },
  },
  loginMessaging: {
    text: "Login",
    type: "button",
    click() {
      loginWidgets("zendesk");
    },
  },
  logoutMessaging: {
    text: "Logout",
    type: "button",
    click() {
      window.zE("messenger", "logoutUser");
      userStore.$reset();
      metadataSet.value = false;
      changeAuthenticationStatus(false);
      window.zE("messenger", "close");
    },
  },
  setMetadata: {
    text: "Set Metadata",
    type: "button",
    click() {
      window.zE("messenger:set", "conversationFields", [
        { id: 17826865089553, value: "test" },
      ]);
      window.zE("messenger:set", "conversationTags", [
        "sales",
        "computer_accessories",
      ]);
      metadataSet.value = true;
    },
  },
  callUs: {
    text: "Call us",
    type: "button",
    click() {
      window.zE(
        "messenger:open",
        "voice",
        import.meta.env.VITE_ZENDESK_VOICE_LINE_ID,
      );
    },
  },
  docs: {
    text: "Dev Docs",
    type: "button",
    click() {
      window.open(
        "https://developer.zendesk.com/api-reference/widget-messaging/web/core/",
        "_blank",
      );
    },
  },
};
</script>

<style lang="scss" scoped>
h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
