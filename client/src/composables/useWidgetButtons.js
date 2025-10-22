import {
  useClearBrowserStorage,
  useGetRandomImageUrl,
} from '@/composables/helpers';
import { ref } from 'vue';
import { useUserStore } from '@/stores/store';
import { useGetSessionAuth, useShowWarningToast } from '@/composables/helpers';
import { useDark, useToggle } from '@vueuse/core';

const userStore = useUserStore();

const { changeAuthenticationStatus, loginWidgets } = userStore;
const metadataSet = ref(false);
const customerMetadataSet = ref(false);
const htmlTag = document.querySelector('html');

const updateWidgetLocale = locale => {
  window.zE('messenger:set', 'locale', `${locale}`);
};

const updateCookieConsent = range => {
  zE('messenger:set', 'cookies', `${range}`);
};

const isDark = useDark({
  onChanged(dark) {
    if (dark) {
      htmlTag.setAttribute('data-bs-theme', 'dark');
    } else {
      htmlTag.setAttribute('data-bs-theme', 'light');
    }
  },
});

const toggleDark = useToggle(isDark);

const lightTheme = {
  primary: '#d1f470',
  onPrimary: '#000000',
  message: '#355e34',
  onMessage: '#FFFFFF',
  action: '#d1f470',
  onAction: '#000000',
  businessMessage: '#16140c',
  onBusinessMessage: '#FFFFFF',
  background: '#2b2b2bff',
  onBackground: '#FFFFFF',
  error: '#CF6679',
  onError: '#000000',
  notify: '#d1f470',
  onNotify: '#000000',
  onSecondaryAction: '#FFFFFF',
};

const darkTheme = {
  primary: '#d1f470',
  onPrimary: '#000000',
  message: 'rgb(17, 17, 13)',
  onMessage: '#FFFFFF',
  action: '#d1f470',
  onAction: '#000000',
  businessMessage: 'rgb(244, 246, 248)',
  onBusinessMessage: '#000000',
  background: '#FFFFFF',
  onBackground: 'rgb(0 0 0 / 65%)',
  error: '#CF6679',
  onError: '#000000',
  notify: '#d1f470',
  onNotify: '#000000',
  onSecondaryAction: '#FFFFFF',
};

const changeColors = () => {
  toggleDark();
  if (isDark.value) {
    window.zE('messenger:set', 'customization', {
      theme: lightTheme,
    });
  } else {
    window.zE('messenger:set', 'customization', {
      theme: darkTheme,
    });
  }
};

const { token: sessionToken, external_id: sessionExternalId } =
  useGetSessionAuth();

const toolsButtons = {
  clearStorage: {
    text: 'Clear Storage',
    type: 'button',
    click() {
      useClearBrowserStorage();
    },
  },
};
const suncoButtons = {
  openSunCo: {
    text: 'Open',
    type: 'button',
    click() {
      window.Smooch.open();
    },
  },
  closeSunCo: {
    text: 'Close',
    type: 'button',
    click() {
      window.Smooch.close();
    },
  },
  loginSunco: {
    text: 'Login',
    type: 'button',
    click() {
      if (sessionToken && sessionExternalId) {
        loginWidgets('sunco');
      } else {
        useShowWarningToast(
          `No JWT in sessionStorage. Please login via the form`,
          1500,
        );
      }
    },
  },
  logoutSunco: {
    text: 'Logout',
    type: 'button',
    click() {
      window.Smooch.logout();
      window.Smooch.close();
      userStore.$reset();
      changeAuthenticationStatus(false);
    },
  },
  sendImage: {
    text: 'Send Image',
    type: 'button',
    click() {
      window.Smooch.sendMessage(
        {
          type: 'image',
          mediaUrl: useGetRandomImageUrl(),
        },
        Smooch.getDisplayedConversation().id,
      );
    },
  },
  docs: {
    text: 'Dev Docs',
    type: 'button',
    click() {
      window.open(
        'https://github.com/zendesk/sunshine-conversations-web',
        '_blank',
      );
    },
  },
};

const zendeskButtons = {
  openMessaging: {
    text: 'Open',
    type: 'button',
    click() {
      window.zE('messenger', 'open');
    },
  },
  closeMessaging: {
    text: 'Close',
    type: 'button',
    click() {
      window.zE('messenger', 'close');
    },
  },
  showMessaging: {
    text: 'Show',
    type: 'button',
    click() {
      window.zE('messenger', 'show');
    },
  },
  hideMessaging: {
    text: 'Hide',
    type: 'button',
    click() {
      window.zE('messenger', 'hide');
    },
  },
  loginMessaging: {
    text: 'Login',
    type: 'button',
    click() {
      if (sessionToken && sessionExternalId) {
        loginWidgets('zendesk');
      } else {
        useShowWarningToast(
          `No JWT in sessionStorage. Please login via the form`,
          1500,
        );
      }
    },
  },
  logoutMessaging: {
    text: 'Logout',
    type: 'button',
    click() {
      window.zE('messenger', 'logoutUser');
      userStore.$reset();
      metadataSet.value = false;
      changeAuthenticationStatus(false);
      window.zE('messenger', 'close');
    },
  },
  setMetadata: {
    text: 'Set Metadata',
    type: 'button',
    code: `window.zE('messenger:set', 'conversationFields', [{ id: 17826865089553, value: 'test'}])\n\nwindow.zE("messenger:set", "conversationTags", ["sales","computer_accessories",]);`,
    click() {
      window.zE('messenger:set', 'conversationFields', [
        { id: 17826865089553, value: 'test' },
      ]);
      window.zE('messenger:set', 'conversationTags', [
        'sales',
        'computer_accessories',
      ]);
      metadataSet.value = true;
    },
  },
  setCustomerMetadata: {
    text: 'Set Customer Metadata',
    type: 'button',
    code: `window.zE('messenger:set', 'conversationFields', [{ id: 26752975385105, value: '12837123'}])`,
    click() {
      window.zE('messenger:set', 'conversationFields', [
        { id: 26752975385105, value: '12837123' },
      ]);
      customerMetadataSet.value = true;
    },
  },
  resetWidget: {
    text: 'Reset Widget',
    type: 'button',
    click() {
      window.zE('messenger', 'resetWidget', function () {
        console.log(`You have reset the messaging Web Widget`);
      });
    },
  },
  callUs: {
    text: 'Call us',
    type: 'button',
    click() {
      window.zE(
        'messenger:open',
        'voice',
        import.meta.env.VITE_ZENDESK_VOICE_LINE_ID,
      );
    },
  },
  customization: {
    text: 'Customization - Dark Theme',
    type: 'button',
    click() {
      changeColors({
        primary: '#d1f470',
        onPrimary: '#000000',
        message: '#355e34',
        onMessage: '#FFFFFF',
        action: '#d1f470',
        onAction: '#000000',
        businessMessage: '#16140c',
        onBusinessMessage: '#FFFFFF',
        background: '#2b2b2bff',
        onBackground: '#FFFFFF',
        error: '#CF6679',
        onError: '#000000',
        notify: '#d1f470',
        onNotify: '#000000',
        onSecondaryAction: '#FFFFFF',
      });
    },
  },
  docs: {
    text: 'Dev Docs',
    type: 'button',
    click() {
      window.open(
        'https://developer.zendesk.com/api-reference/widget-messaging/web/core/',
        '_blank',
      );
    },
  },
};

export {
  toolsButtons,
  suncoButtons,
  zendeskButtons,
  updateWidgetLocale,
  updateCookieConsent,
  metadataSet,
  customerMetadataSet,
};
