import { useAIAgentStore } from "@/store/useAIAgentStore";

export async function SET_STATE(payload: any) {
  useAIAgentStore.getState().set(payload.key, payload.value);
}

export async function SET_FORM(payload: any) {
  useAIAgentStore.getState().setForm(payload.formId, payload.data);
}

export async function RESET_FORM(payload: any) {
  useAIAgentStore.getState().resetForm(payload.formId);
}
