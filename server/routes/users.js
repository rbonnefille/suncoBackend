import express from 'express';
const router = express.Router();
import SunCoClient from '../utils/suncoApi.js';
import checkOrigin from '../middleware/validateOrigin.js';

router.use(checkOrigin); // Register the checkOrigin middleware globally

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
  if (conversations.hasOwnProperty('conversations')) {
    res.json(conversations);
  } else {
    res.status(404).json({ error: 'Conversations not found' });
  }
});

router.get('/:id/clients', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const clientsList = await sunCo.listClients(userId);
  if (clientsList.hasOwnProperty('clients')) {
    res.json(clientsList);
  } else {
    res.status(404).json({ error: 'Clients not found' });
  }
});

router.get('/:id/devices', async (req, res) => {
  const { id: userId } = req.params;
  const sunCo = new SunCoClient();
  const devicesList = await sunCo.listDevices(userId);
  if (devicesList.hasOwnProperty('devices')) {
    res.json(devicesList);
  } else {
    res.status(404).json({ error: 'Devices not found' });
  }
});

export default router;
