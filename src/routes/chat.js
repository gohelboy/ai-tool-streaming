import { Router } from "express";
import { ai } from "../lib/ai.js";
import { financeTool } from "../tools/transactions.js";

const router = Router();

const SYSTEM =
  "Finance assistant. Use getTransactions to read. Use createTransaction to add. Use updateTransaction to edit by id. Never invent data.";

// POST /chat — streams answer text to browser (SSE)
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await ai.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      contents: message,
      config: { systemInstruction: SYSTEM, tools: [financeTool] },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify(chunk.text)}\n\n`);
      }
    }

    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
    res.end();
  }
});

export default router;
