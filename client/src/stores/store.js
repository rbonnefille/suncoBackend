// userStore.js
import { defineStore } from 'pinia';
import { useLoginUserZDWidget } from '@/composables/useZendesk';
import { useLoginUserSunCoWidget } from '@/composables/useSunco';
import { useGetSessionAuth } from '@/composables/helpers';

// export const store = reactive({
//   authenticated: false,
//   external_id: undefined,
//   changeAuthenticationStatus(authenticated, external_id) {
//     this.authenticated = authenticated
//     this.external_id = external_id
//   }
// })

export const useUserStore = defineStore('user', {
  state: () => ({
    authenticated: false,
    external_id: null,
    title: null,
    sessionStorage: null,
  }),
  actions: {
    changeAuthenticationStatus(authenticated, external_id) {
      this.authenticated = authenticated;
      this.external_id = external_id;
    },
    loginWidgets(widget) {
      const { token, external_id } = useGetSessionAuth();
      if (external_id && token) {
        this.changeAuthenticationStatus(true, external_id);
        switch (widget) {
          case 'sunco':
            useLoginUserSunCoWidget(external_id, token);
            break;
          case 'zendesk':
            useLoginUserZDWidget(token);
            break;
          default:
            useLoginUserSunCoWidget(external_id, token);
            useLoginUserZDWidget(token);
            break;
        }
      }
    },
    getters: {
      connectedAs: state => {
        return `You are connected as: ${state.external_id}`;
      },
      // titleConnectedAs: (state) => {
      //   return state.external_id ? `👋 ${state.external_id}` : "Acme Dashboard"
      // }
    },
  },
});
