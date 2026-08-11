import pool from "../db.js";

export async function getTransactions() {
  const { rows } = await pool.query(
    "SELECT * FROM transactions ORDER BY created_at DESC",
  );
  return rows;
}

export async function createTransaction({ amount, type, category, description }) {
  const { rows } = await pool.query(
    `INSERT INTO transactions (amount, type, category, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [amount, type, category, description],
  );
  return rows[0];
}

export async function updateTransaction({ id, amount, type, category, description }) {
  const { rows } = await pool.query(
    `UPDATE transactions
     SET amount = $1, type = $2, category = $3, description = $4
     WHERE id = $5
     RETURNING *`,
    [amount, type, category, description, id],
  );
  return rows[0];
}

export const financeTool = {
  tool: async () => ({
    functionDeclarations: [
      {
        name: "getTransactions",
        description: "Get all transactions.",
      },
      {
        name: "createTransaction",
        description: "Add transaction. type = income or expense.",
        parametersJsonSchema: {
          type: "object",
          properties: {
            amount: { type: "number" },
            type: { type: "string" },
            category: { type: "string" },
            description: { type: "string" },
          },
          required: ["amount", "type", "category", "description"],
        },
      },
      {
        name: "updateTransaction",
        description: "Update a transaction by id.",
        parametersJsonSchema: {
          type: "object",
          properties: {
            id: { type: "number" },
            amount: { type: "number" },
            type: { type: "string" },
            category: { type: "string" },
            description: { type: "string" },
          },
          required: ["id", "amount", "type", "category", "description"],
        },
      },
    ],
  }),

  callTool: async (calls) => {
    const { name, args } = calls[0];
    console.log("Tool:", name, args);

    let data;

    if (name === "getTransactions") {
      data = await getTransactions();
    } else if (name === "createTransaction") {
      data = await createTransaction(args);
    } else if (name === "updateTransaction") {
      data = await updateTransaction(args);
    } else {
      data = { error: "Unknown tool" };
    }

    return [{ functionResponse: { name, response: { data } } }];
  },
};
