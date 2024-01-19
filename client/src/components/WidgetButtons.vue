<template>
  <h4 class="mt-5">SunCo Web Widget</h4>
  <div class="col-auto" role="group" aria-label="Actions">
    <VButton
      v-for="(button, key) in suncoButtons"
      v-once
      :key="key"
      :button="button"
    />
  </div>
  <h4 class="mt-5">Zendesk Web Widget</h4>
  <div class="col-auto" role="group" aria-label="Actions">
    <VButton
      v-for="(button, key) in zendeskButtons"
      v-once
      :key="key"
      :button="button"
    />
  </div>
  <div v-if="metadataSet">
    <h4 class="mt-5">Metadata were set with</h4>
    <div>
      <code
        >window.zE('messenger:set', 'conversationFields', [{ id: 17826865089553,
        value: 'test'}])</code
      >
    </div>
    <div>
      <code
        >window.zE('messenger:set', 'conversationTags', ["sales",
        "computer_accessories"]);</code
      >
    </div>
  </div>
</template>

<script setup>
import VButton from "@/components/VButton.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/store";
import { clearBrowserStorage, getRandomImageUrl } from "@/utils/helpers.js";

const userStore = useUserStore();

const { changeAuthenticationStatus, loginWidgets } = userStore;

const metadataSet = ref(false);

const suncoButtons = {
  openSunCo: {
    btnText: "Open Widget",
    btnType: "button",
    btnClick() {
      window.Smooch.open();
    },
  },
  closeSunCo: {
    btnText: "Close Widget",
    btnType: "button",
    btnClick() {
      window.Smooch.close();
    },
  },
  loginSunco: {
    btnText: "Login",
    btnType: "button",
    btnClick() {
      loginWidgets("sunco");
    },
  },
  logoutSunco: {
    btnText: "Logout",
    btnType: "button",
    btnClick() {
      window.Smooch.logout();
      window.Smooch.close();
      userStore.$reset();
      changeAuthenticationStatus(false);
    },
  },
  sendImage: {
    btnText: "Send Image",
    btnType: "button",
    btnClick() {
      window.Smooch.sendMessage(
        {
          type: "image",
          mediaUrl: getRandomImageUrl(),
        },
        Smooch.getDisplayedConversation().id
      );
    },
  },
  clearLocalStorage: {
    btnText: "Clear browserStorage",
    btnType: "button",
    btnClick() {
      clearBrowserStorage();
      window.Smooch.close();
    },
  },
};

const zendeskButtons = {
  openMessaging: {
    btnText: "Open Widget",
    btnType: "button",
    btnClick() {
      window.zE("messenger", "open");
    },
  },
  closeMessaging: {
    btnText: "Close Widget",
    btnType: "button",
    btnClick() {
      window.zE("messenger", "close");
    },
  },
  showMessaging: {
    btnText: "Show Widget",
    btnType: "button",
    btnClick() {
      window.zE("messenger", "show");
    },
  },
  hideMessaging: {
    btnText: "Hide Widget",
    btnType: "button",
    btnClick() {
      window.zE("messenger", "hide");
    },
  },
  loginMessaging: {
    btnText: "Login",
    btnType: "button",
    btnClick() {
      loginWidgets("zendesk");
    },
  },
  logoutMessaging: {
    btnText: "Logout",
    btnType: "button",
    btnClick() {
      window.zE("messenger", "logoutUser");
      userStore.$reset();
      metadataSet.value = false;
      changeAuthenticationStatus(false);
      window.zE("messenger", "close");
    },
  },
  setMetadata: {
    btnText: "Set Metadata",
    btnType: "button",
    btnClick() {
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
    btnText: "Call us",
    btnType: "button",
    btnClick() {
      window.zE(
        "messenger:open",
        "voice",
        import.meta.env.VITE_ZENDESK_VOICE_LINE_ID
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
