// Chat message type
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mode?: "plan" | "complete";
  steps?: Array<{ id: string; description: string; status: "pending" | "completed" | "current" }>;
}

// Action types for extensible action system
export type Action =
  | { type: "OPEN_MODAL"; payload: { modalId: string; data?: any } }
  | { type: "CLOSE_MODAL"; payload: { modalId: string } }
  | { type: "NAVIGATE"; payload: { url: string; data?: any } }
  | { type: "SHOW_TOAST"; payload: { message: string; type: "success" | "error" | "info" } }
  | { type: "SET_STATE"; payload: { key: string; value: any } }
  | { type: "SET_FORM"; payload: { formId: string; data: any } }
  | { type: "RESET_FORM"; payload: { formId: string } }
  | { type: "CONFIRMATION"; payload: { message: string; nextAction: Action } }
  | { type: "OPEN_VIEW"; payload: { target: string; data?: any } }
  | { type: "UPDATE_FORM"; payload: { data: any } };

// API response format (STRICT)
export interface ChatResponse {
  chat: string;
  actions: Action[];
  mode?: "plan" | "complete"; // Optional for legacy/internal use
  steps?: Array<{ id: string; description: string; status: "pending" | "completed" | "current" }>;
}

// Modal types
export interface Modal {
  id: string;
  title: string;
  content: string;
  actions?: Action[];
}
