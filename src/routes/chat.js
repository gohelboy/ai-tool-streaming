import { Router } from "express";
import { ai } from "../lib/ai.js";
import { financeTool } from "../tools/transactions.js";
import { SYSTEM_PROMPT } from "../prompts/system.js";
import { saveMessage, getMessages } from "../conversation.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    const id = conversationId;
    const history = await getMessages(id);

    const contents = [
      ...history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    await saveMessage(id, "user", message);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await ai.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, tools: [financeTool] },
    });

    let fullText = "";
    let usage = null;

    for await (const chunk of stream) {
      if (chunk.usageMetadata) {
        usage = {
          prompt: chunk.usageMetadata.promptTokenCount ?? 0,
          completion: chunk.usageMetadata.candidatesTokenCount ?? 0,
          total: chunk.usageMetadata.totalTokenCount ?? 0,
        };
      }

      const text = chunk.text;
      if (!text) continue;
      fullText += text;
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    await saveMessage(id, "model", fullText);
    res.write(`data: ${JSON.stringify({ done: true, usage })}\n\n`);
    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
