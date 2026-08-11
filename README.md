# Finance AI Assistant

Simple beginner project: **Node + Express + EJS + PostgreSQL + Gemini AI**.

Chat in the browser. AI reads and adds transactions in PostgreSQL.

## Run

```bash
cd backend
pnpm install
pnpm dev
```

Open http://localhost:3000

## .env

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/finance_ai
GEMINI_API_KEY=your_key
```

## Files to read (in order)

1. `src/db.js` — database
2. `src/tools/transactions.js` — AI tools
3. `src/routes/chat.js` — streaming chat API (SSE)
4. `public/js/chat.js` — read stream and show text live

## Try in chat

- How much did I spend on food?
- Add expense 50 for food as Snacks

## Check data

http://localhost:3000/transactions
