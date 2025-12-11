import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import SunshineConversationsClient from 'sunshine-conversations-client';

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

const {
  APP_ID: appId,
  POD_BASE_URL: podBaseUrl,
  KEY_ID: username,
  SECRET_KEY: password,
  BASE_URL: baseUrl,
  SWITCHBOARD_ID: switchboardId,
} = process.env;

class SunCoClient {
  constructor() {
    this.setApiClient();
    this.appId = appId;
    this.switchboardId = switchboardId;
  }
  setApiClient() {
    const defaultClient = SunshineConversationsClient.ApiClient.instance;
    const basicAuth = defaultClient.authentications['basicAuth'];
    basicAuth.username = username;
    basicAuth.password = password;
    defaultClient.basePath = podBaseUrl || baseUrl;
  }

  getUserIdOrExternalId(payload) {
    if (payload.hasOwnProperty('userId')) {
      return payload.userId;
    } else if (payload.hasOwnProperty('externalId')) {
      return payload.externalId;
    }
    return payload;
  }

  buildMessageContent(message, image, metadata) {
    if (image) {
      return {
        type: 'image',
        mediaUrl: image,
        text: message,
      };
    }
    return {
      type: 'text',
      text: message,
      metadata,
    };
  }

  async postActivity(payload) {
    const { conversationId, author } = payload;
    const apiInstance = new SunshineConversationsClient.ActivitiesApi();
    const activityPost = new SunshineConversationsClient.ActivityPost();
    activityPost.author = author;
    activityPost.type = 'typing:start';
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
    messagePost.author = author;
    messagePost.content = this.buildMessageContent(message, image, metadata);
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
    const opts = {
      page: new SunshineConversationsClient.Page(),
    };
    opts.page.size = 100;
    try {
      return await apiInstance.listClients(
        this.appId,
        userIdOrExternalId,
        opts
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async listDevices(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const apiInstance = new SunshineConversationsClient.DevicesApi();
    try {
      return await apiInstance.listDevices(this.appId, userIdOrExternalId);
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }

  async getUser(payload) {
    const userIdOrExternalId = this.getUserIdOrExternalId(payload);
    const url = `${podBaseUrl}/v2/apps/${this.appId}/users/${userIdOrExternalId}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response?.data?.errors?.[0]?.title || error.response?.status;
    }
  }

  async getUserByEmailIdentity(payload) {
    const { email: userEmail } = payload;
    const url = `${podBaseUrl}/v2/apps/${this.appId}/users?filter[identities.email]=${userEmail}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response?.data?.errors?.[0]?.title || error.response?.status;
    }
  }

  async listParticipants(conversationId) {
    const apiInstance = new SunshineConversationsClient.ParticipantsApi();
    try {
      return await apiInstance.listParticipants(this.appId, conversationId);
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

  async listConversations(webhookData) {
    const userIdOrExternalId = this.getUserIdOrExternalId(webhookData);
    const filter =
      Object.keys(userIdOrExternalId).length === 24
        ? `userId`
        : `userExternalId`;
    const url = `${podBaseUrl}/v2/apps/${this.appId}/conversations?filter[${filter}]=${userIdOrExternalId}&page[size]=100`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response?.data?.errors?.[0]?.title || error.response?.status;
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

  async updateSwitchboardIntegration(payload) {
    let {
      switchboardIntegrationId,
      nextSwitchboardIntegrationId,
      deliverStandbyEvents,
      messageHistoryCount,
    } = payload;
    const apiInstance =
      new SunshineConversationsClient.SwitchboardIntegrationsApi();
    let switchboardIntegrationUpdateBody = {
      nextSwitchboardIntegrationId:
        nextSwitchboardIntegrationId === undefined
          ? undefined
          : nextSwitchboardIntegrationId,
      ...(deliverStandbyEvents !== undefined && {
        deliverStandbyEvents: Boolean(deliverStandbyEvents),
      }),
      messageHistoryCount:
        messageHistoryCount == 0 ? null : parseInt(messageHistoryCount, 10),
    };
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

  async updateIntegration(integrationId, bodyParams) {
    const apiInstance = new SunshineConversationsClient.IntegrationsApi();
    try {
      return await apiInstance.updateIntegration(
        this.appId,
        integrationId,
        bodyParams
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error;
    }
  }

  async listIntegrationsPerChannelResponder() {
    const listIntegrations = await axios.get(
      `${podBaseUrl}/v2/apps/${appId}/integrations?page[size]=100`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
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

  async uploadAttachment(source, conversationId) {
    const apiInstance = new SunshineConversationsClient.AttachmentsApi();
    const access = 'public'; // String | The access level for the attachment. Currently the only available access level is public. Private is not supported.
    const opts = {
      _for: 'message', // String | Specifies the intended container for the attachment, to enable automatic attachment deletion (on deletion of associated message, conversation or user). For now, only message is supported. See [Attachments for Messages](#section/Attachments-for-Messages) for details.
      conversationId: conversationId, // String | Links the attachment getting uploaded to the conversation ID.
    };
    try {
      return await apiInstance.uploadAttachment(
        this.appId,
        access,
        source,
        opts
      );
    } catch (error) {
      // catch error
      return error.body?.errors[0]?.title || error.status;
    }
  }
}
export default SunCoClient;
