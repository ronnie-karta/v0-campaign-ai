# Runbook: Local Dev Setup

## Prerequisites
- Node.js 18+
- pnpm (`npm i -g pnpm`)
- PostgreSQL running locally
- n8n running locally (`npx n8n`)

## Steps

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env:
#   DATABASE_URL=postgresql://user:pass@localhost:5432/karta_ai
#   N8N_WEBHOOK_URL=http://localhost:5678/webhook/karta-ai
```

### 3. Set up database
```bash
pnpm db:migrate   # run Prisma migrations
pnpm db:seed      # seed initial data
```

### 4. Import n8n workflow
- Open n8n at `http://localhost:5678`
- Import `karta-ai-workflow.json`
- In the **AI Agent** node, ensure **Prompt (User Message)** is set to:
  ```
  ={{ JSON.stringify($json.body) }}
  ```
- Activate the workflow

### 5. Start dev server
```bash
pnpm dev
```
App runs at `http://localhost:3000`

## Troubleshooting

| Issue | Fix |
|---|---|
| Chat returns 500 | Check n8n is running and workflow is active |
| DB connection error | Verify `DATABASE_URL` in `.env` |
| n8n session key error | Set a static `sessionId` in `/api/chat/route.ts` |
