# Campaign Creation via Chat - Integration Guide

## Overview

Users can now create email and SMS campaigns directly through the AI chat interface. When a user asks to create a campaign, the chat AI responds with an action that opens the full campaign creation modal.

## How It Works

### 1. Chat Interaction Flow

```
User: "Create a campaign" or "I want to create an email campaign"
         ↓
API processes message and identifies campaign intent
         ↓
Returns response with OPEN_CAMPAIGN action
         ↓
Action Dispatcher triggers campaign modal
         ↓
CampaignModal component renders full 5-step form
         ↓
User completes campaign and submits
```

### 2. Triggering Campaign Creation

Users can trigger campaign creation by saying any of:
- "Create a campaign"
- "New campaign"
- "I want to create a campaign"
- "Campaign" (opens basic campaign modal)

### 3. Action Types

The system includes a new `OPEN_CAMPAIGN` action type:

```typescript
{
  type: "OPEN_CAMPAIGN",
  payload: {
    data: {} // Optional pre-filled campaign data
  }
}
```

## Architecture

### Updated Components

1. **CampaignModal** (`/components/campaigns/CampaignModal.tsx`)
   - Full-featured modal component
   - Handles 5-step form workflow
   - Manages form state and validation
   - Integrates with Zustand store to close modal

2. **ModalManager** (`/components/ai-chat/ModalManager.tsx`)
   - Enhanced to detect `campaign-creation` modal type
   - Routes to CampaignModal component
   - Handles other modal types as before

3. **Action Dispatcher** (`/lib/actionDispatcher.ts`)
   - Added `OPEN_CAMPAIGN` case
   - Sets active modal to "campaign-creation"
   - Passes optional pre-filled data

4. **Mock API** (`/app/api/chat/route.ts`)
   - Updated with campaign-related responses
   - Detects keywords: "campaign", "create campaign", "new campaign"
   - Returns appropriate chat message + OPEN_CAMPAIGN action

### Type Updates

Updated `/lib/types.ts`:
```typescript
export type ActionType = "OPEN_MODAL" | "NAVIGATE" | "SET_STATE" | "OPEN_CAMPAIGN";
```

## Example API Response

```json
{
  "chat": "Great! Let's create a new campaign. I'm opening the campaign builder for you...",
  "actions": [
    {
      "type": "OPEN_CAMPAIGN",
      "payload": {
        "data": {}
      }
    }
  ]
}
```

## Pre-filled Campaign Data

You can pass pre-filled data to the campaign modal:

```typescript
{
  type: "OPEN_CAMPAIGN",
  payload: {
    data: {
      name: "Summer Sale",
      type: "email",
      description: "Annual summer promotion",
      budget: 500
    }
  }
}
```

The CampaignModal will merge this data with its default state.

## User Flow Example

1. User opens chat window
2. User types: "I want to create an email campaign for my summer sale"
3. AI responds: "Perfect! Let's set up your summer campaign. I'm launching the campaign builder now."
4. Campaign modal opens with full form
5. User fills out all 5 steps:
   - Campaign details
   - Message customization
   - Recipients (upload CSV or add manually)
   - Delivery schedule
   - Payment method
6. User clicks "Create Campaign"
7. Campaign is saved (currently mock, can integrate with real API)
8. Modal closes and user returns to chat

## Integration with Real Backend

To integrate with a real backend:

1. Update `CampaignModal` handleSubmit to call your API:
```typescript
const handleSubmit = async () => {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  // Handle response
};
```

2. Add campaign storage (database) support
3. Add payment processing integration
4. Add email/SMS delivery service integration

## Files Changed

- `/lib/types.ts` - Added OPEN_CAMPAIGN action type
- `/lib/actionDispatcher.ts` - Added OPEN_CAMPAIGN case
- `/components/ai-chat/ModalManager.tsx` - Added campaign modal routing
- `/app/api/chat/route.ts` - Added campaign response keywords
- `/components/campaigns/CampaignModal.tsx` - NEW: Campaign modal component

## Testing

Try these phrases in the chat:
- "Create a campaign"
- "New campaign"
- "I want to make an email campaign"
- "Can you help me create an SMS campaign?"

The modal should open with the full campaign creation form ready to use.
