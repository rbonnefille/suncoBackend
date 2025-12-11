import express from 'express';
const router = express.Router();
import SunCoClient from '../utils/suncoApi.js';
import checkOrigin from '../middleware/validateOrigin.js';

router.use(checkOrigin); // Register the checkOrigin middleware globally

router.get('/switchboardIntegration', async (_, res) => {
  const sunCo = new SunCoClient();
  const switchboardIntegrations = await sunCo.listSwitchboardIntegrations();
  res.json(switchboardIntegrations);
});

router.get('/', async (_, res) => {
  const sunCo = new SunCoClient();
  const switchboards = await sunCo.listSwitchboards();
  res.json(switchboards);
});

router.patch('/', async (req, res) => {
  const sunCo = new SunCoClient();
  const { enabled, defaultSwitchboardIntegrationId } = req.body;
  const switchboards = await sunCo.updateSwitchboard(
    enabled,
    defaultSwitchboardIntegrationId
  );
  res.json(switchboards);
});

router.patch('/switchboardIntegration', async (req, res) => {
  const sunCo = new SunCoClient();
  const switchboardIntegration = await sunCo.updateSwitchboardIntegration(
    req.body
  );
  res.json(switchboardIntegration);
});

router.post('/switchboardIntegration', async (req, res) => {
  const sunCo = new SunCoClient();
  const {
    integrationName,
    integrationId,
    deliverStandbyEvents,
    nextSwitchboardIntegrationId,
    messageHistoryCount,
  } = req.body;
  const newSwitchboardIntegration = await sunCo.createSwitchboardIntegration(
    integrationName,
    integrationId,
    deliverStandbyEvents,
    nextSwitchboardIntegrationId,
    messageHistoryCount
  );
  res.json(newSwitchboardIntegration);
});

export default router;
