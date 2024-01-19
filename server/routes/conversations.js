import express from "express";
import SunCoClient from "../utils/suncoApi.js";
const router = express.Router();

router.head("/", (_, res) => {
  return res.sendStatus(200).end();
});

router.get("/:id", async (req, res) => {
  const { id: conversationId } = req.params;
  const sunCo = new SunCoClient();
  const conversation = await sunCo.getConversation(conversationId);
  res.json(conversation.conversation);
});

router.get("/:id/messages", async (req, res) => {
  const { id: conversationId } = req.params;
  const sunCo = new SunCoClient();
  const conversationMessages = await sunCo.listMessages(conversationId);
  res.json(conversationMessages);
});

export default router;
