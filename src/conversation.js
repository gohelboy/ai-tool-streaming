import pool from "./db.js";

export async function createConversation(name = "New chat") {
  const { rows } = await pool.query(
    `INSERT INTO conversations (name) VALUES ($1) RETURNING id, name, created_at`,
    [name.trim().slice(0, 80) || "New chat"],
  );
  return rows[0];
}

export async function getConversations() {
  const { rows } = await pool.query(
    `SELECT id, name, created_at
     FROM conversations
     ORDER BY created_at DESC`,
  );
  return rows;
}

export async function updateConversationName(id, name) {
  const { rows } = await pool.query(
    `UPDATE conversations SET name = $1 WHERE id = $2 RETURNING id, name, created_at`,
    [name.trim().slice(0, 80) || "New chat", id],
  );
  return rows[0];
}

export async function deleteConversation(id) {
  await pool.query(`DELETE FROM messages WHERE conversation_id = $1`, [id]);
  const { rowCount } = await pool.query(
    `DELETE FROM conversations WHERE id = $1`,
    [id],
  );
  return rowCount > 0;
}

export async function saveMessage(conversationId, role, content) {
  await pool.query(
    `INSERT INTO messages (conversation_id, role, content)
     VALUES ($1, $2, $3)`,
    [conversationId, role, content],
  );
}

export async function getMessages(conversationId) {
  const { rows } = await pool.query(
    `SELECT role, content
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId],
  );
  return rows;
}
