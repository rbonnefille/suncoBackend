// routes/index.js
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import conversationRouter from './conversations.js';
import switchboardsRouter from './switchboards.js';
import integrationRouter from './integrations.js';

import userRouter from './users.js';

import returnToken from '../utils/auth.js';

const router = express.Router();

router.use('/conversations', conversationRouter);
router.use('/switchboards', switchboardsRouter);
router.use('/integrations', integrationRouter);
router.use('/users', userRouter);
router.post('/auth', returnToken);

export default router;
