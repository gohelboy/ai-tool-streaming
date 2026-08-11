import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM transactions ORDER BY created_at DESC",
  );
  res.json(rows);
});

export default router;
