# ADR-001: Use n8n as AI Backend

## Status
Accepted

## Context
The chat assistant needs persistent memory across messages and a flexible AI agent pipeline without coupling business logic to the Next.js server.

## Decision
Use n8n as the AI orchestration backend. Next.js proxies chat requests to an n8n webhook which handles memory (Simple Memory node), AI processing (AI Agent node), and response formatting.

## Consequences
- **Good**: AI logic is decoupled from the app — editable without code deploys
- **Good**: n8n Simple Memory handles session-based conversation history
- **Bad**: Local dev requires n8n running on `localhost:5678`
- **Bad**: n8n production URL must be configured via `N8N_WEBHOOK_URL` env var
