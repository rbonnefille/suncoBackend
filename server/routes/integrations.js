import express from 'express';
const router = express.Router();
import SunCoClient from '../utils/suncoApi.js';
import checkOrigin from '../middleware/validateOrigin.js';

router.use(checkOrigin); // Register the checkOrigin middleware globally

router.get('/', async (_, res) => {
  const sunCo = new SunCoClient();
  const integrations = await sunCo.listIntegrationsPerChannelResponder();
  res.json(integrations);
});

router.patch('/:id', async (req, res) => {
  const { id: integrationId } = req.params;
  const sunCo = new SunCoClient();
  const integrations = await sunCo.updateIntegration(integrationId, req.body);
  res.json(integrations);
});

export default router;
