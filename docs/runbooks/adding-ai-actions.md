# Runbook: Adding a New AI Action

AI actions are commands the n8n AI agent sends back to the client to control the UI.

## 1. Define the action type constant
In `lib/ai/constants.ts`, add your new action type:
```ts
export const AI_COMMANDS = {
  // ...existing
  MY_ACTION: "MY_ACTION",
} as const;
```

## 2. Add the type to the Action union
In `lib/types.ts`:
```ts
export type Action =
  | { type: "MY_ACTION"; payload: { ... } }
  | // ...existing
```

## 3. Implement the handler
Add a handler function in the appropriate file under `lib/ai/handlers/`:
- `uiHandlers.ts` — show/hide UI elements, open modals
- `stateHandlers.ts` — update Zustand store state
- `dataHandlers.ts` — load/save data
- `systemHandlers.ts` — navigate, reset

## 4. Register the handler
In `lib/ai/handlers/index.ts`, add your action to the dispatch map:
```ts
MY_ACTION: myActionHandler,
```

## 5. Tell n8n
Update your n8n workflow's AI Agent system prompt to include instructions on when to emit `MY_ACTION` and what payload shape to use.
