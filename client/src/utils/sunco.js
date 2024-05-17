import { ref } from 'vue';
import { showSuccessToast, showWarningToast } from './helpers.js';

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
const selectedIntegrationId = ref({});

const smoochConfig = {
  integrationId: import.meta.env.VITE_SUNCO_INTEGRATION_ID,
  canUserSeeConversationList: true,
  soundNotificationEnabled: false,
  // customColors: {
  //   brandColor: 'FFFFFF',
  //   conversationColor: '#9a4497',
  //   actionColor: 'F6F0E6',
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
const addOnclickListener = () => {
  const webMessenger = document.getElementById('web-messenger-container');
  const messengerContent = webMessenger.contentDocument;
  messengerContent.addEventListener('click', (event) => {
    setTimeout(async () => {
      if (event.target.tagName.toLowerCase() === 'button') {
        window.Smooch.createConversation().then((conversation) =>
          window.Smooch.loadConversation(conversation.id)
        );
      }
    }, 100);
  });
};

export const initSunco = () => {
  window.Smooch.init(smoochConfig).then(() => {
    console.log('SunCo widget ready');
    const user = window.Smooch.getUser();
    console.log(user);
    addOnclickListener();
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

  window.Smooch.on('widget:opened', () => {
    if (
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
  });
};

const fetchSunCoUser = async (userId) => {
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
          devicesData.error
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

const fetchIntegrations = async () => {
  try {
    isLoading.value = true;
    const response = await fetch('/integrations');
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    integrations.value = data.integrations;
  } catch (error) {
    showWarningToast(error.message);
  }
  isLoading.value = false;
};

const updateSwitchboard = async (
  enabled = true,
  defaultSwitchboardIntegrationId
) => {
  try {
    isLoadingSwitchboardUpdate.value = true;
    const response = await fetch('/integrations/switchboards', {
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
    showSuccessToast('Switchboard updated');
  } catch (error) {
    console.error('An error occurred while updating the switchboard:', error);
    showWarningToast(error);
  }
  isLoadingSwitchboardUpdate.value = false;
};

const updateSwitchboardIntegration = async (
  switchboardIntegrationId,
  nextSwitchboardIntegrationId
) => {
  try {
    isLoadingSwitchboardIntegrationUpdate.value = true;
    const response = await fetch('/integrations/switchboardIntegration', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        switchboardIntegrationId,
        nextSwitchboardIntegrationId,
      }),
    });
    const data = await response.json();
    const { name: sbIntegrationName } = data.switchboardIntegration;
    showSuccessToast(`Switchboard integration ${sbIntegrationName} updated`);
  } catch (error) {
    console.error(
      'An error occurred while updating the switchboard integration:',
      error
    );
    showWarningToast(error.message);
  }
  isLoadingSwitchboardIntegrationUpdate.value = false;
};

const fetchSwitchboardIntegrations = async () => {
  try {
    isLoading.value = true;
    const [sbintegrationsResponse, switchboardsResponse] = await Promise.all([
      fetch('/integrations/sbintegrations'),
      fetch('/integrations/switchboards'),
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
    // Populate the selectedIntegrationId object with the initial values of the nextSwitchboardIntegrationId for each switchboard integration
    switchboardIntegrations.value.forEach((integration) => {
      selectedIntegrationId.value[integration.id] =
        integration.nextSwitchboardIntegrationId;
    });
  } catch (error) {
    showWarningToast(error.message);
  }
  isLoading.value = false;
};

const createSwitchboardIntegration = async (
  integrationName,
  integrationId,
  deliverStandbyEvents,
  nextSwitchboardIntegrationId,
  messageHistoryCount
) => {
  try {
    isLoadingSwitchboardIntegrationUpdate.value = true;
    const response = await fetch('/integrations/switchboardIntegration', {
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
    if (data.error) {
      throw new Error(data.error);
    }
    switchboardIntegrations.value.push(data.switchboardIntegration);
    selectedIntegrationId.value[data.switchboardIntegration.id] =
      data.switchboardIntegration.nextSwitchboardIntegrationId;
    showSuccessToast('Switchboard integration created');
  } catch (error) {
    console.error(
      'An error occurred while updating the switchboard:',
      error.message
    );
    showWarningToast(error.message);
  }
  isLoadingSwitchboardIntegrationUpdate.value = false;
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
  selectedIntegrationId,
  integrations,
  suncoUser,
  suncoUserClients,
  suncoUserConversations,
  suncoUserDevices,
  fetchSunCoUser,
  fetchIntegrations,
  updateSwitchboard,
  updateSwitchboardIntegration,
  fetchSwitchboardIntegrations,
  createSwitchboardIntegration,
};
