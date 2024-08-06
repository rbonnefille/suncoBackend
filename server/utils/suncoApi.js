import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import SunshineConversationsClient from 'sunshine-conversations-client';

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

class SunCoClient {
  constructor() {
    this.setApiClient();
    this.appId = process.env.APP_ID;
    this.switchboardId = process.env.SWITCHBOARD_ID;
  }
  setApiClient() {
    const defaultClient = SunshineConversationsClient.ApiClient.instance;
    const basicAuth = defaultClient.authentications['basicAuth'];
    basicAuth.username = process.env.KEY_ID;
    basicAuth.password = process.env.SECRET_KEY;
    defaultClient.basePath = process.env.POD_BASE_URL || process.env.BASE_URL;
  }

  async postActivity(payload) {
    const { conversationId, author } = payload;
    const apiInstance = new SunshineConversationsClient.ActivitiesApi();
    const activityPost = {
      author: author,
      type: 'typing:start',
    };
    try {
      return await apiInstance.postActivity(
        this.appId,
        conversationId,
        activityPost
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async sendMessage(payload) {
    const { conversationId, author, message, image, metadata } = payload;
    await this.postActivity(payload);
    await timeout(300);
    const apiInstance = new SunshineConversationsClient.MessagesApi();
    const messagePost = new SunshineConversationsClient.MessagePost();
    messagePost.setAuthor(author);
    if (image) {
      messagePost.setContent({
        type: 'image',
        mediaUrl: image,
        text: message,
      });
    } else {
      messagePost.setContent({
        type: 'text',
        text: message,
        metadata: metadata,
      });
    }
    try {
      return await apiInstance.postMessage(
        this.appId,
        conversationId,
        messagePost
      );
    } catch (error) {
      return error.response?.text;
    }
  }

  async listClients(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const apiInstance = new SunshineConversationsClient.ClientsApi();
    try {
      return await apiInstance.listClients(this.appId, userIdOrExternalId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listDevices(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const devicesListResponse = await axios.get(
      `${process.env.POD_BASE_URL}/v2/apps/${process.env.APP_ID}/users/${userIdOrExternalId}/devices`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${process.env.KEY_ID}:${process.env.SECRET_KEY}`)}`,
        },
      }
    );
    try {
      return await devicesListResponse.data;
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async getUser(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const apiInstance = new SunshineConversationsClient.UsersApi();
    try {
      return await apiInstance.getUser(this.appId, userIdOrExternalId);
    } catch (error) {
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async updateUser(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const apiInstance = new SunshineConversationsClient.UsersApi();
    const userUpdateBody = new SunshineConversationsClient.UserUpdateBody();
    userUpdateBody.metadata = {
      botDialog: true,
    };
    try {
      return await apiInstance.updateUser(
        this.appId,
        userIdOrExternalId,
        userUpdateBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async getConversation(payload) {
    const conversationId = payload.conversationId || payload;
    const apiInstance = new SunshineConversationsClient.ConversationsApi();
    try {
      return await apiInstance.getConversation(this.appId, conversationId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listMessages(payload) {
    const { conversationId } = payload;
    const apiInstance = new SunshineConversationsClient.MessagesApi();
    try {
      return await apiInstance.listMessages(this.appId, conversationId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async updateConversation(payload) {
    const { conversationId } = payload;
    const apiInstance = new SunshineConversationsClient.ConversationsApi();
    const conversationUpdateBody =
      new SunshineConversationsClient.ConversationUpdateBody();
    conversationUpdateBody.displayName = new Date().toLocaleString('en-us', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    try {
      return await apiInstance.updateConversation(
        this.appId,
        conversationId,
        conversationUpdateBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listConversations(webhookData) {
    const apiInstance = new SunshineConversationsClient.ConversationsApi();
    const filter = new SunshineConversationsClient.ConversationListFilter();
    const userIdOrExternalId = this.getUserIdOrExternalId(webhookData);
    if (Object.keys(userIdOrExternalId).length === 24) {
      filter.setUserId(userIdOrExternalId);
    } else {
      filter.setUserExternalId(userIdOrExternalId);
    }
    try {
      return await apiInstance.listConversations(this.appId, filter);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async deleteConversation(conversationId) {
    const apiInstance = new SunshineConversationsClient.ConversationsApi();
    try {
      return await apiInstance.deleteConversation(this.appId, conversationId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async passControl(
    payload,
    switchboardIntegration = process.env.NEXT_SWITCHBOARD_INTEGRATION
  ) {
    const { conversationId, metadata } = payload;
    const apiInstance = new SunshineConversationsClient.SwitchboardActionsApi();
    const passControlBody = new SunshineConversationsClient.PassControlBody();
    passControlBody.switchboardIntegration = switchboardIntegration;
    if (metadata) {
      passControlBody.metadata = metadata;
      console.log(
        `Switchboard metadata sent ${JSON.stringify(passControlBody, null, 2)}`
      );
    }
    try {
      return await apiInstance.passControl(
        this.appId,
        conversationId,
        passControlBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async offerControl(payload) {
    const { conversationId, metadata } = payload;
    const apiInstance = new SunshineConversationsClient.SwitchboardActionsApi();
    const offerControlBody = new SunshineConversationsClient.OfferControlBody();
    if (metadata) {
      offerControlBody.metadata = metadata;
      console.log(offerControlBody.metadata);
    }
    try {
      return await apiInstance.offerControl(
        this.appId,
        conversationId,
        offerControlBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async releaseControl(payload) {
    const { conversationId } = payload;
    const apiInstance = new SunshineConversationsClient.SwitchboardActionsApi();
    const offerControlBody = new SunshineConversationsClient.OfferControlBody();
    if (metadata) {
      offerControlBody.metadata = metadata;
      console.log(offerControlBody.metadata);
    }
    try {
      return await apiInstance.releaseControl(this.appId, conversationId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listSwitchboards() {
    const apiInstance = new SunshineConversationsClient.SwitchboardsApi();
    try {
      return await apiInstance.listSwitchboards(this.appId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listSwitchboardIntegrations() {
    const apiInstance =
      new SunshineConversationsClient.SwitchboardIntegrationsApi();
    try {
      return await apiInstance.listSwitchboardIntegrations(
        this.appId,
        this.switchboardId
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async updateSwitchboard(enabled = true, defaultSwitchboardIntegrationId) {
    const apiInstance = new SunshineConversationsClient.SwitchboardsApi();
    let switchboardUpdateBody =
      new SunshineConversationsClient.SwitchboardUpdateBody();

    switchboardUpdateBody.enabled = Boolean(enabled);

    if (defaultSwitchboardIntegrationId) {
      switchboardUpdateBody.defaultSwitchboardIntegrationId =
        defaultSwitchboardIntegrationId;
    }
    try {
      return await apiInstance.updateSwitchboard(
        this.appId,
        this.switchboardId,
        switchboardUpdateBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async updateSwitchboardIntegration(
    switchboardIntegrationId,
    nextSwitchboardIntegrationId
  ) {
    const apiInstance =
      new SunshineConversationsClient.SwitchboardIntegrationsApi();
    const switchboardIntegrationUpdateBody =
      new SunshineConversationsClient.SwitchboardIntegrationUpdateBody();
    switchboardIntegrationUpdateBody.nextSwitchboardIntegrationId =
      nextSwitchboardIntegrationId;
    try {
      return await apiInstance.updateSwitchboardIntegration(
        this.appId,
        this.switchboardId,
        switchboardIntegrationId,
        switchboardIntegrationUpdateBody
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async createSwitchboardIntegration(
    integrationName,
    integrationId,
    deliverStandbyEvents,
    nextSwitchboardIntegrationId,
    messageHistoryCount = 10
  ) {
    const apiInstance =
      new SunshineConversationsClient.SwitchboardIntegrationsApi();
    let switchboardIntegrationCreateBody =
      new SunshineConversationsClient.SwitchboardIntegrationCreateBody();
    switchboardIntegrationCreateBody.name = integrationName;
    switchboardIntegrationCreateBody.integrationId = integrationId;
    switchboardIntegrationCreateBody.deliverStandbyEvents =
      deliverStandbyEvents;
    switchboardIntegrationCreateBody.nextSwitchboardIntegrationId =
      nextSwitchboardIntegrationId;
    switchboardIntegrationCreateBody.messageHistoryCount = messageHistoryCount;
    try {
      return await apiInstance.createSwitchboardIntegration(
        this.appId,
        this.switchboardId,
        switchboardIntegrationCreateBody
      );
    } catch (error) {
      // catch error
      console.log(error.body?.errors[0]?.title);
      return { error: error.body?.errors[0]?.title };
    }
  }

  async listIntegrations() {
    const apiInstance = new SunshineConversationsClient.IntegrationsApi();
    try {
      return await apiInstance.listIntegrations(this.appId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listIntegrationsPerChannelResponder() {
    const listIntegrations = await axios.get(
      `${process.env.POD_BASE_URL}/v2/apps/${process.env.APP_ID}/integrations`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${process.env.KEY_ID}:${process.env.SECRET_KEY}`)}`,
        },
      }
    );
    try {
      return await listIntegrations.data;
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  getUserIdOrExternalId(payload) {
    if (payload.hasOwnProperty('userId')) {
      return payload.userId;
    } else if (payload.hasOwnProperty('externalId')) {
      return payload.externalId;
    }
    return payload;
  }
}

export default SunCoClient;
