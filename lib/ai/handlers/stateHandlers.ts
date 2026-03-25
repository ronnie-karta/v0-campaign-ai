import { useAIAgentStore } from "@/store/useAIAgentStore";
import { ActionContext } from "../actionDispatcher";

export async function SET_STATE(payload: any, context?: ActionContext) {
  useAIAgentStore.getState().set(payload.key, payload.value);
}

export async function SET_FORM(payload: any, context?: ActionContext) {
  const currentData = useAIAgentStore.getState().forms[payload.formId] || {};
  useAIAgentStore.getState().setForm(payload.formId, { ...currentData, ...payload.data });
}

export async function RESET_FORM(payload: any, context?: ActionContext) {
  useAIAgentStore.getState().resetForm(payload.formId);
}
