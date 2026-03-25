// Chat message type
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Action types for extensible action system
export type Action =
  | { type: "OPEN_MODAL"; payload: { modalId: string; data?: any } }
  | { type: "CLOSE_MODAL"; payload: { modalId: string } }
  | { type: "NAVIGATE"; payload: { route: string } }
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
  | { type: "CONFIRMATION"; payload: { message: string; confirmAction: Action } }
  | { type: "DOWNLOAD_FILE"; payload: { url: string; filename: string } };

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
