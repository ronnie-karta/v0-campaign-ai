# ADR-002: Zustand for Client State

## Status
Accepted

## Context
Campaign builder state (active step, form data) and chat state (messages, loading) need to be shared across deeply nested components without prop drilling.

## Decision
Use Zustand with separate stores per domain: `useAIAgentStore`, `useCampaignUIStore`, `useUIStore`.

## Consequences
- **Good**: Minimal boilerplate, no Provider wrapper needed
- **Good**: Stores are independently testable
- **Bad**: No built-in devtools (must add zustand/middleware manually)
