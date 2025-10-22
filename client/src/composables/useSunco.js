import { ref } from 'vue';
import {
  useShowSuccessToast,
  useShowWarningToast,
} from '@/composables/helpers';

const suncoUser = ref(null);
const suncoUserClients = ref(null);
const suncoUserConversations = ref(null);
const suncoUserDevices = ref(null);
const isLoadingSwitchboardUpdate = ref(false);
const isLoadingSwitchboardIntegrationUpdate = ref(false);
const switchboards = ref(null);
const isLoading = ref(false);
const switchboardIntegrations = ref(null);
const integrations = ref(null);
const isSwitchboardEnabled = ref(null);
const errorMessage = ref(null);
const defaultSwitchboardIntegrationIdSelected = ref(null);
const selectedNextSwitchboardIntegrationId = ref({});

const smoochConfig = {
  integrationId: import.meta.env.VITE_SUNCO_INTEGRATION_ID,
  canUserSeeConversationList: true,
  soundNotificationEnabled: false,
  // integrationOrder: []
  // customColors: {
  //   brandColor: 'FFFFFF',
  //   conversationColor: '#D1F470',
  //   actionColor: 'F5F5F2',
  // },
  // delegate: {
  //   beforeDisplay(message, data) {
  //     if (
  //       message.role === 'business' &&
  //       message.source.type === 'zd:answerBot'
  //     ) {
  //       message.displayName = 'Virtual Assistant';
  //       message.avatarUrl =
  //         'https://www.gravatar.com/avatar/00000000000000000000000000000000.png?s=200&d=mm';
  //     }
  //     return message;
  //   },
  // },
};

// const toggleFooter = (showInput) => {
//   const iframe = document.querySelector('iframe');
//   const footer = iframe.contentDocument.querySelector('#footer');
//   if (!showInput) {
//     if (footer) {
//       iframe.contentDocument.querySelector('#footer').style.display = 'none';
//     }
//   } else {
//     if (footer) {
//       iframe.contentDocument.querySelector('#footer').style.display = 'flex';
//     }
//   }
// };

const useLoginUserSunCoWidget = async (external_id, token) => {
  const checkSunCoLoaded = () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (window.Smooch) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  };

  await checkSunCoLoaded();
  window.Smooch.login(external_id, token);
  window.Smooch.open();
};

const useAddOnclickListener = () => {
  const webMessenger = document.getElementById('web-messenger-container');
  const messengerContent = webMessenger.contentDocument;
  messengerContent.addEventListener('click', event => {
    setTimeout(async () => {
      if (event.target.tagName.toLowerCase() === 'button') {
        window.Smooch.createConversation().then(conversation =>
          window.Smooch.loadConversation(conversation.id),
        );
      }
    }, 100);
  });
};

export const useInitSunco = () => {
  window.Smooch.init(smoochConfig).then(() => {
    console.log('SunCo widget ready');
    const user = window.Smooch.getUser();
    console.log(user);
    // const conversation = Smooch.getDisplayedConversation();
    // toggleFooter(conversation.metadata.showInput);
    useAddOnclickListener();
    // if (
    //   Smooch.getConversations().length === 0 ||
    //   !Smooch.getConversations().find(
    //     (conversation) => conversation.metadata.brand === metadataBrand
    //   )
    // ) {
    //   Smooch.createConversation({
    //     metadata: {
    //       brand: metadataBrand,
    //       'zen:ticket:tags': window.location.href,
    //     },
    //   }).then((conversation) => {
    //     Smooch.loadConversation(conversation.id);
    //   });
    // } else {
    //   const userConvos = Smooch.getConversations();
    //   const { id: conversationId } = userConvos.find(
    //     (conversation) => conversation.metadata.brand === metadataBrand
    //   );
    //   Smooch.loadConversation(conversationId);
    //   Smooch.updateConversation(conversationId, {
    //     metadata: {
    //       'zen:ticket:tags': window.location.href,
    //     },
    //   });
    // }
  });

  window.Smooch.on('widget:opened', async () => {
    const conversations = await window.Smooch.getConversations();
    if (conversations && conversations.length) {
      window.Smooch.loadConversation(conversations[0].id);
    } else if (
      !window.Smooch.getUser() ||
      window.Smooch.getConversations().length === 0
    ) {
      window.Smooch.createConversation();
    }
  });

  window.Smooch.on('widget:closed', function () {
    console.log('Widget is closed!');
  });

  window.Smooch.on('ready', () => {
    console.log('window.Smooch is ready');
    // console.log(`Convo length ${window.Smooch.getConversations().length}`)
    // if (window.Smooch.getConversations().length === 0) {
    //   window.Smooch.destroy();
    // }
    const iframe = document.getElementById('web-messenger-container');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const style = iframeDoc.createElement('style');
    style.type = 'text/css';
    style.appendChild(
      iframeDoc.createTextNode('.messages-container .logo { display: none; }'),
    );
    iframeDoc.head.appendChild(style);
  });
  // Smooch.on('message:received', function (message, data) {
  //   if (message.metadata) {
  //     toggleFooter(message.metadata.showInput);
  //   }
  // });
};

const useFetchConversations = async userId => {
  try {
    const conversationsResponse = await fetch(`/users/${userId}/conversations`);
    const conversationsData = await conversationsResponse.json();
    if (conversationsData.error) {
      throw new Error(conversationsData.error);
    }
    suncoUserConversations.value = conversationsData.conversations;
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  }
};

const useFetchSunCoUser = async userId => {
  try {
    isLoading.value = true;
    const [
      userResponse,
      clientsResponse,
      conversationsResponse,
      devicesResponse,
    ] = await Promise.all([
      fetch(`/users/${userId}`),
      fetch(`/users/${userId}/clients`),
      fetch(`/users/${userId}/conversations`),
      fetch(`/users/${userId}/devices`),
    ]);

    const [userData, clientsData, conversationsData, devicesData] =
      await Promise.all([
        userResponse.json(),
        clientsResponse.json(),
        conversationsResponse.json(),
        devicesResponse.json(),
      ]);

    if (
      userData.error ||
      clientsData.error ||
      conversationsData.error ||
      devicesData.error
    ) {
      throw new Error(
        userData.error ||
          clientsData.error ||
          conversationsData.error ||
          devicesData.error,
      );
    }

    // Assign the values
    suncoUser.value = userData.user;
    suncoUserClients.value = clientsData.clients;
    suncoUserConversations.value = conversationsData.conversations;
    suncoUserDevices.value = devicesData.devices;
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  }
  isLoading.value = false;
};

const useFetchIntegrations = async () => {
  try {
    isLoading.value = true;
    const response = await fetch('/integrations');
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    integrations.value = data.integrations;
  } catch (error) {
    useShowWarningToast(error.message);
  }
  isLoading.value = false;
};

const useUpdateIntegration = async (
  integrationId,
  canUserCreateMoreConversations,
  canUserSeeConversationList,
  defaultResponderId,
) => {
  try {
    isLoading.value = true;
    const response = await fetch(`/integrations/${integrationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        canUserCreateMoreConversations,
        canUserSeeConversationList,
        defaultResponderId,
      }),
    });
    await response.json();
    useShowSuccessToast(`Integration ${integrationId} updated`);
    await useFetchIntegrations();
  } catch (error) {
    console.error('An error occurred while updating the integration:', error);
    useShowWarningToast(error);
  }
  isLoading.value = false;
};

const useUpdateSwitchboard = async (
  enabled = true,
  defaultSwitchboardIntegrationId,
) => {
  try {
    isLoadingSwitchboardUpdate.value = true;
    const response = await fetch('/switchboards', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: Boolean(enabled),
        defaultSwitchboardIntegrationId,
      }),
    });
    const data = await response.json();
    switchboards.value = data.switchboard;
    useShowSuccessToast('Switchboard updated');
  } catch (error) {
    console.error('An error occurred while updating the switchboard:', error);
    useShowWarningToast(error);
  }
  isLoadingSwitchboardUpdate.value = false;
};

const useUpdateSwitchboardIntegration = async (
  switchboardIntegrationId,
  nextSwitchboardIntegrationId,
  messageHistoryCount,
  deliverStandbyEvents,
) => {
  try {
    isLoadingSwitchboardIntegrationUpdate.value = true;
    const body = JSON.stringify({
      switchboardIntegrationId,
      nextSwitchboardIntegrationId,
      messageHistoryCount,
      deliverStandbyEvents,
    });
    const response = await fetch('/switchboards/switchboardIntegration', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    await response.json();
    useShowSuccessToast(
      `Switchboard integration ${switchboardIntegrationId} updated`,
    );
  } catch (error) {
    console.error(
      'An error occurred while updating the switchboard integration:',
      error,
    );
    useShowWarningToast(error.message);
  }
  isLoadingSwitchboardIntegrationUpdate.value = false;
};

const useFetchSwitchboardIntegrations = async () => {
  try {
    isLoading.value = true;
    const [sbintegrationsResponse, switchboardsResponse] = await Promise.all([
      fetch('/switchboards/switchboardIntegration'),
      fetch('/switchboards'),
    ]);
    const sbintegrationsData = await sbintegrationsResponse.json();
    const switchboardsData = await switchboardsResponse.json();
    if (sbintegrationsData?.error || switchboardsData?.error) {
      throw new Error(sbintegrationsData.error || switchboardsData.error);
    }
    switchboardIntegrations.value = sbintegrationsData?.switchboardIntegrations;
    switchboards.value = switchboardsData?.switchboards[0];
    isSwitchboardEnabled.value = switchboardsData?.switchboards[0].enabled
      ? 'Enabled'
      : 'Disabled';
    defaultSwitchboardIntegrationIdSelected.value =
      switchboardsData?.switchboards[0].defaultSwitchboardIntegrationId;
    // Populate the selectedNextSwitchboardIntegrationId object with the initial values of the nextSwitchboardIntegrationId for each switchboard integration
    switchboardIntegrations.value.forEach(integration => {
      selectedNextSwitchboardIntegrationId.value[integration.id] =
        integration.nextSwitchboardIntegrationId;
    });
  } catch (error) {
    useShowWarningToast(error.message);
  }
  isLoading.value = false;
};

const useCreateSwitchboardIntegration = async (
  integrationName,
  integrationId,
  deliverStandbyEvents,
  nextSwitchboardIntegrationId,
  messageHistoryCount,
) => {
  try {
    isLoadingSwitchboardIntegrationUpdate.value = true;
    const response = await fetch('/switchboards/switchboardIntegration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        integrationName,
        integrationId,
        deliverStandbyEvents,
        nextSwitchboardIntegrationId,
        messageHistoryCount,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      throw new Error(data.error);
    }
    switchboardIntegrations.value.push(data.switchboardIntegration);
    selectedNextSwitchboardIntegrationId.value[data.switchboardIntegration.id] =
      data.switchboardIntegration.nextSwitchboardIntegrationId;
    useShowSuccessToast('Switchboard integration created');
  } catch (error) {
    console.error(
      'An error occurred while updating the switchboard:',
      error.message,
    );
    useShowWarningToast(error.message);
  }
  isLoadingSwitchboardIntegrationUpdate.value = false;
};

const useDeleteConversations = async userId => {
  try {
    isLoading.value = true;
    const response = await fetch(`/users/${userId}/conversations`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    const message =
      data.deletedConversations > 1
        ? `${data.deletedConversations} conversations deleted`
        : data.deletedConversations === 1
          ? `${data.deletedConversations} conversation deleted`
          : 'No conversation to delete';
    useShowSuccessToast(message);
    setTimeout(() => {
      useFetchConversations(userId);
      isLoading.value = false;
    }, 2000);
  } catch (error) {
    useShowWarningToast(error.message);
  }
};

export {
  isLoadingSwitchboardUpdate,
  isLoadingSwitchboardIntegrationUpdate,
  switchboards,
  isLoading,
  switchboardIntegrations,
  isSwitchboardEnabled,
  errorMessage,
  defaultSwitchboardIntegrationIdSelected,
  selectedNextSwitchboardIntegrationId,
  integrations,
  suncoUser,
  suncoUserClients,
  suncoUserConversations,
  suncoUserDevices,
  useLoginUserSunCoWidget,
  useFetchSunCoUser,
  useFetchIntegrations,
  useUpdateSwitchboard,
  useUpdateSwitchboardIntegration,
  useFetchSwitchboardIntegrations,
  useCreateSwitchboardIntegration,
  useDeleteConversations,
  useUpdateIntegration,
};
