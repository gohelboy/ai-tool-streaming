import "dotenv/config";
import express from "express";
import chatRoutes from "./routes/chat.js";
import conversationRoutes from "./routes/conversations.js";
import transactionRoutes from "./routes/transaction.js";
import pool from "./db.js";

const app = express();
const PORT = 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

app.use(express.json());

// Allow Next.js frontend to call this API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "Finance AI API", health: "/health" });
});

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/chat", chatRoutes);
app.use("/conversations", conversationRoutes);
app.use("/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
