# Campaign AI — Claude Project Memory

## Project Overview
Campaign AI is a Next.js 14 marketing campaign platform with an AI chat assistant powered by n8n workflows. Users create and manage campaigns through a multi-step form guided by an AI chat interface.

## Tech Stack
- **Framework**: Next.js 14 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL via Prisma ORM
- **State**: Zustand stores
- **AI Backend**: n8n webhook (`/api/karta-ai`)
- **Package Manager**: pnpm

## Key Directories
| Path | Purpose |
|---|---|
| `app/api/` | Next.js API routes |
| `app/api/chat/` | AI chat proxy → n8n webhook |
| `app/api/chat-mock/` | Offline mock chat (regex intent matching) |
| `components/ai-chat/` | Floating chat widget & campaign chat panel |
| `components/campaigns/` | Campaign builder UI (steps, layout, views) |
| `lib/ai/` | Action dispatcher + intent handlers |
| `lib/ai/handlers/` | UI, state, data, system action handlers |
| `store/` | Zustand stores (AI agent, campaign UI, global UI) |
| `prisma/` | Schema, migrations, seeders |
| `docs/` | Architecture docs and decisions |
| `.claude/skills/` | Reusable Claude skills for this project |

## Architecture Principles
- AI chat sends `{ message, context }` to `/api/chat` which proxies to n8n
- n8n responds with `{ chat, actions[] }` — actions are dispatched client-side
- Two chat surfaces: floating `ChatWidget` (global) and `CampaignAIChatPanel` (campaign builder only)
- `ChatWidget` is hidden on `/campaigns/create` to avoid conflict
- Campaign builder is a 5-step form with independent Zustand state per step

## Environment Variables
```
N8N_WEBHOOK_URL=        # n8n production webhook
N8N_WEBHOOK_URL_TEST=   # n8n test webhook (optional)
DATABASE_URL=           # PostgreSQL connection string
```

## Important Conventions
- Always use `pnpm` (not npm or yarn)
- API routes live in `app/api/` using Next.js Route Handlers
- Shared types are in `lib/types.ts` and `lib/campaign-types.ts`
- All AI action types are defined in `lib/ai/constants.ts`
- Use shadcn/ui components from `components/ui/` — do not install duplicate UI libs
