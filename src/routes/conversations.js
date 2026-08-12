import { Router } from "express";
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  updateConversationName,
} from "../conversation.js";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await getConversations());
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  const conversation = await createConversation(name);
  res.status(201).json(conversation);
});

router.patch("/:id", async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  const conversation = await updateConversationName(req.params.id, name);

  if (!conversation) {
    return res.status(404).json({ error: "conversation not found" });
  }

  res.json(conversation);
});

router.delete("/:id", async (req, res) => {
  const deleted = await deleteConversation(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "conversation not found" });
  }

  res.json({ ok: true });
});

router.get("/:id/messages", async (req, res) => {
  res.json(await getMessages(req.params.id));
});

export default router;
