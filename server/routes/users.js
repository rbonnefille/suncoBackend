import express from 'express';
const router = express.Router();
import SunCoClient from '../utils/suncoApi.js';
import checkOrigin from '../middleware/validateOrigin.js';

router.use(checkOrigin); // Register the checkOrigin middleware globally

router.post('/listUser', async (req, res) => {
  const userEmail = req.body;
  const sunCo = new SunCoClient();
  const user = await sunCo.getUserByEmailIdentity(userEmail);
  if (user && user.hasOwnProperty('users') && user.users.length > 0) {
    res.json(user.users[0]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const sunCo = new SunCoClient();
  const user = await sunCo.getUser(userId);
  if (user?.hasOwnProperty('user')) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/:id/conversations', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const conversations = await sunCo.listConversations(userId);
  if (conversations && conversations.hasOwnProperty('conversations')) {
    res.json(conversations);
  } else {
    res.status(404).json({ error: 'Conversations not found' });
  }
});

router.delete('/:id/conversations', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const allConversations = await sunCo.listConversations(userId);
  try {
    let countDeletedConversations = 0;
    allConversations.conversations.forEach(async (convo) => {
      if (
        convo.activeSwitchboardIntegration?.name !== 'zd-agentWorkspace' &&
        !convo.isDefault
      ) {
        countDeletedConversations++;
        sunCo.deleteConversation(convo.id);
      }
    });
    res.json({ deletedConversations: countDeletedConversations });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting conversations' });
  }
});

router.get('/:id/clients', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const clientsList = await sunCo.listClients(userId);
  if (clientsList && clientsList.hasOwnProperty('clients')) {
    res.json(clientsList);
  } else {
    res.status(404).json({ error: 'Clients not found' });
  }
});

router.get('/:id/devices', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const devicesList = await sunCo.listDevices(userId);
  if (devicesList && devicesList.hasOwnProperty('devices')) {
    res.json(devicesList);
  } else {
    res.status(404).json({ error: 'Devices not found' });
  }
});

export default router;
