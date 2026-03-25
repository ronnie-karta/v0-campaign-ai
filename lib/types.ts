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
  | { type: "OPEN_MODAL"; payload: { modal: string; prefill?: any } }
  | { type: "CLOSE_MODAL"; payload: { modalId: string } }
  | { type: "NAVIGATE"; payload: { url: string; prefill?: any } }
  | { type: "OPEN_CAMPAIGN"; payload: { data?: any } }
  | { type: "OPEN_DRAWER"; payload: { drawerId: string; data?: any } }
  | { type: "SHOW_TOAST"; payload: { message: string; type: "success" | "error" | "info" } }
  | { type: "SET_STATE"; payload: { key: string; value: any } }
  | { type: "SET_FORM"; payload: { formId: string; data: any } }
  | { type: "RESET_FORM"; payload: { formId: string } }
  | { type: "CREATE_ENTITY"; payload: { entity: string; data: any } }
  | { type: "UPDATE_ENTITY"; payload: { entity: string; id: string; data: any } }
  | { type: "DELETE_ENTITY"; payload: { entity: string; id: string } }
  | { type: "FETCH_DATA"; payload: { entity: string; filters?: any } }
  | { type: "RUN_WORKFLOW"; payload: { workflow: string; data?: any } }
  | { type: "CONFIRMATION"; payload: { message: string; nextAction: Action } }
  | { type: "REQUEST_CONFIRMATION"; payload: { message: string; nextAction: Action } }
  | { type: "DOWNLOAD_FILE"; payload: { url: string; filename: string } };

// API response format
export interface ChatResponse {
  mode: "plan" | "complete";
  chat: string;
  actions?: Action[];
  steps?: Array<{ id: string; description: string; status: "pending" | "completed" | "current" }>;
  // Optional legacy fields for backward compatibility if needed, but we'll try to stick to the prompt
  message?: string;
  intent?: string;
  confidence?: number;
  entities?: Record<string, any>;
}

// Modal types
export interface Modal {
  id: string;
  title: string;
  content: string;
  actions?: Action[];
}
