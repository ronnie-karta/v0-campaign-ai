# Karta AI — Architecture Overview

## System Diagram

```
Browser
  │
  ├─ ChatWidget (floating, global)
  │    └─ hidden on /campaigns/create
  │
  ├─ CampaignAIChatPanel (campaign builder sidebar)
  │
  └─ useAIAgentStore (Zustand)
       │
       ▼
  /api/chat  (Next.js Route Handler)
       │
       ▼
  n8n Webhook  (/api/karta-ai)
       │  Simple Memory node (session-based)
       │  AI Agent node (Claude/OpenAI)
       │
       ▼
  Response: { chat: string, actions: Action[] }
       │
       ▼
  actionDispatcher (lib/ai/actionDispatcher.ts)
       │
       ├─ NAVIGATE       → router.push()
       ├─ OPEN_VIEW      → useCampaignUIStore
       ├─ SET_STATE      → campaign step state
       ├─ FILL_FORM      → form field updates
       └─ RESET_FORM     → form resets
```

## Chat Flow

1. User types message in chat input
2. `useAIAgentStore.sendMessage()` POSTs `{ message, context }` to `/api/chat`
3. `/api/chat` forwards to n8n with `{ body: message, sessionId, context }`
4. n8n processes through memory + AI agent nodes
5. Response `{ chat, actions }` returns to client
6. `actionDispatcher` dispatches each action to the appropriate handler
7. UI updates reactively via Zustand

## Campaign Views

| Route | Component | Purpose |
|---|---|---|
| `/campaigns` | `CampaignListView` | Lists all campaigns |
| `/campaigns/create` | `CampaignFormView` | 5-step campaign builder |
| `/campaigns/[id]` | `CampaignViewView` | Read-only campaign detail view |

## Campaign Builder (5 Steps)

| Step | Name | Key Data |
|---|---|---|
| 1 | Identity & Goals | name, type, budget, description |
| 2 | Creative Content | senderName, subject, messageContent |
| 3 | Target Audience | recipients array |
| 4 | Logistics & Delivery | scheduleType, sendDateTime, timezone |
| 5 | Final Review & Payment | paymentMethod, billingEmail, agreeToTerms |

## Data Layer

- **ORM**: Prisma with PostgreSQL
- **Models**: Campaign, Recipient (see `prisma/schema.prisma`)
- **API Routes**: `/api/campaigns/` — CRUD for campaigns and recipients
- **Seed**: `prisma/seed.ts` + `prisma/seeders/`

## State Management

| Store | Purpose |
|---|---|
| `useAIAgentStore` | Chat messages, loading state, sendMessage action |
| `useCampaignUIStore` | Active step, form data per step, open/close state |
| `useUIStore` | Global UI flags (e.g., modal open states) |
