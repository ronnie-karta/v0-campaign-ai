# Karta AI Chat System Documentation

## Overview

A production-ready AI Chat system for Next.js that provides:
- Global floating chat widget (bottom-right)
- Real-time message handling with optimistic UI
- Action dispatching system for extensible functionality
- Global state management with Zustand
- Full TypeScript support

## Architecture

### Component Hierarchy

```
ChatWidget (Floating Container)
├── ChatButton (Toggle)
└── ChatWindow (when isOpen)
    ├── Header
    ├── MessageList
    │   └── ChatMessage (repeated)
    │   └── ThinkingIndicator (when loading)
    └── ChatInput

ModalManager (Global)
└── Modal (rendered conditionally)
```

### State Management

The system uses Zustand for global state management via `useAIAgentStore`:

```typescript
{
  messages: Message[]           // Chat history
  isLoading: boolean            // API call in progress
  isOpen: boolean               // Widget visibility
  activeModal: string | null    // Current modal ID
  modalData: Record<...>        // Modal data
  actionQueue: Action[]         // Pending actions
}
```

### File Structure

```
/app
  /api/chat/route.ts           # Chat API endpoint
  layout.tsx                   # ChatWidget & ModalManager integration
  page.tsx                     # Home page
  globals.css                  # Global styles + animations

/components/ai-chat
  ChatWidget.tsx              # Main floating widget
  ChatWindow.tsx              # Chat interface
  ChatMessage.tsx             # Individual message
  ChatInput.tsx               # Input form
  ModalManager.tsx            # Modal controller

/store
  useAIAgentStore.ts          # Zustand store & hook

/lib
  types.ts                    # TypeScript interfaces
  actionDispatcher.ts         # Action processing

/hooks
  useAIAgent.ts               # Custom hook with action processing
```

## Usage

### Basic Message Sending

```tsx
import { useAIAgent } from '@/hooks/useAIAgent';

export function MyComponent() {
  const { sendMessage, messages, isLoading } = useAIAgent();

  const handleSend = async (text: string) => {
    await sendMessage(text);
  };

  return (
    // Your component JSX
  );
}
```

### Accessing Chat State

```tsx
const {
  messages,           // Message[]
  isLoading,         // boolean
  isOpen,            // boolean
  setOpen,           // (isOpen: boolean) => void
  activeModal,       // string | null
  modalData,         // Record<string, unknown> | null
  setActiveModal,    // (id: string | null, data?: Record<...>) => void
} = useAIAgent();
```

## API Integration

### Chat Endpoint

**Route:** `POST /api/chat`

**Request:**
```json
{
  "message": "User input text",
  "messages": [
    { "role": "user", "content": "Previous messages..." }
  ],
  "context": {
    "currentPage": "/campaigns/create",
    "activeForm": "campaignForm",
    "currentStep": 1,
    "formData": {}
  }
}
```

**Response (STRICT JSON)**

The system operates in two modes:

#### 1. PLAN MODE
Used when the AI needs to guide the user through multiple steps.
```json
{
  "mode": "plan",
  "chat": "I'll guide you through creating a campaign in 3 main steps:",
  "steps": [
    { "id": "1", "description": "Set basic info (name, budget)", "status": "pending" },
    { "id": "2", "description": "Define your audience", "status": "pending" },
    { "id": "3", "description": "Customize campaign content", "status": "pending" }
  ],
  "actions": [
    { "type": "NAVIGATE", "payload": { "url": "/campaigns/create" } }
  ]
}
```

#### 2. COMPLETE MODE
Used for immediate actions or single-turn responses.
```json
{
  "mode": "complete",
  "chat": "Opening campaign builder.",
  "actions": [
    {
      "type": "OPEN_CAMPAIGN",
      "payload": { "data": {} }
    }
  ]
}
```

## Action System

The action dispatcher processes actions returned from the API:

### Action Types

#### OPEN_MODAL
Opens a modal with specified data.
```typescript
{
  type: "OPEN_MODAL",
  payload: {
    modal: "modal-id",
    prefill: { title: "...", content: "..." }
  }
}
```

#### NAVIGATE
Navigates to a route:
```typescript
{
  type: "NAVIGATE",
  payload: {
    url: "/target-route"
  }
}
```

#### SET_STATE
Updates application state (e.g., `campaignStep`):
```typescript
{
  type: "SET_STATE",
  payload: {
    key: "state-key",
    value: "new-value"
  }
}
```

#### SET_FORM
Updates form data (e.g., `campaignForm`):
```typescript
{
  type: "SET_FORM",
  payload: {
    formId: "form-id",
    data: { ... }
  }
}
```

#### CONFIRMATION
Requests user confirmation before proceeding.
```typescript
{
  type: "CONFIRMATION",
  payload: {
    message: "Are you sure?",
    nextAction: { ... }
  }
}
```

## Styling

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Accent: Light Gray (#F3F4F6)

### Key CSS Classes
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-bounce` - Bounce animation (loading indicator)

## Extending the System

### Adding a New Action Type

1. Update `Action` type in `/lib/types.ts`:
```typescript
export type ActionType = "OPEN_MODAL" | "NAVIGATE" | "SET_STATE" | "NEW_ACTION";
```

2. Handle in `/lib/actionDispatcher.ts`:
```typescript
case "NEW_ACTION": {
  // Your logic here
  break;
}
```

### Customizing the Chat Widget

Edit `/components/ai-chat/ChatWidget.tsx` to:
- Change positioning (bottom-right, top-left, etc.)
- Modify colors and styling
- Adjust size and animations
- Add custom header/footer

### Creating a Custom Chat Response

Modify `/app/api/chat/route.ts` to:
- Connect to a real AI API
- Process user messages
- Return appropriate actions

## Features

### Optimistic UI
- User messages appear immediately
- Loading indicator shown during API call
- Error messages displayed if request fails

### Auto-scroll
- Messages auto-scroll to bottom
- Smooth scroll behavior

### Responsive Design
- Adapts to mobile/tablet
- Touch-friendly input
- Optimized widget size

### Animations
- Smooth fade-in for messages
- Slide-up animation for widget
- Bounce animation for loading indicator

## Testing

### Test Cases

1. **Message Flow**
   - Send message → appears optimistically
   - API responds → assistant message added
   - Actions queue processed

2. **Modal Actions**
   - OPEN_MODAL action → modal displays
   - Modal close → modal disappears

3. **Widget Toggle**
   - Click button → widget opens
   - Click button again → widget closes
   - Messages persist across toggles

4. **Multiple Pages**
   - Open chat on page A
   - Navigate to page B
   - Chat widget and history persist

## Performance Considerations

- Zustand provides minimal re-renders
- Messages stored in memory (no persistence)
- API calls debounced via form submission
- CSS animations use GPU acceleration

## Future Enhancements

- Message persistence (localStorage/database)
- Typing indicators
- Read receipts
- Voice input/output
- Message search
- Export chat history
- Custom themes
- Conversation branching
