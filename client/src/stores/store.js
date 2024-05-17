// userStore.js
import { defineStore } from 'pinia';

// export const store = reactive({
//   authenticated: false,
//   external_id: undefined,
//   changeAuthenticationStatus(authenticated, external_id) {
//     this.authenticated = authenticated
//     this.external_id = external_id
//   }
// })

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    authenticated: false,
    external_id: null,
    title: null,
  }),
  actions: {
    changeAuthenticationStatus(authenticated, external_id) {
      this.authenticated = authenticated;
      this.external_id = external_id;
    },
    loginWidgets(widget) {
      const { external_id, token } =
        JSON.parse(sessionStorage.getItem('suncoWidgetAuth')) || {};
      if (external_id && token) {
        this.changeAuthenticationStatus(true, external_id);
        if (widget === 'sunco') {
          window.Smooch.on('ready', function () {
            console.log('the init has completed!');
            window.Smooch.login(external_id, token);
            window.Smooch.open();
          });
        } else if (widget === 'zendesk') {
          window.zE('messenger', 'loginUser', (callback) => {
            callback(token);
            window.zE('messenger', 'open');
          });
        } else {
          window.Smooch.on('ready', function () {
            console.log('the init has completed!');
            window.Smooch.login(external_id, token);
            window.Smooch.open();
          });
          window.zE('messenger', 'loginUser', (callback) => {
            callback(token);
            window.zE('messenger', 'open');
          });
        }
      }
    },
    getters: {
      connectedAs: (state) => {
        return `You are connected as: ${state.external_id}`;
      },
      // titleConnectedAs: (state) => {
      //   return state.external_id ? `👋 ${state.external_id}` : "Acme Dashboard"
      // }
    },
  },
});
