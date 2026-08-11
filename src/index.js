import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";
import transactionRoutes from "./routes/transaction.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/chat", chatRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (_req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
