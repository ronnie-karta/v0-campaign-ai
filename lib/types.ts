// Chat message type
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Action types for extensible action system
export type ActionType = "OPEN_MODAL" | "NAVIGATE" | "SET_STATE" | "OPEN_CAMPAIGN";

export interface Action {
  type: ActionType;
  payload?: Record<string, unknown>;
}

// API response format
export interface ChatResponse {
  chat: string;
  actions?: Action[];
}

// Modal types
export interface Modal {
  id: string;
  title: string;
  content: string;
  actions?: Action[];
}
