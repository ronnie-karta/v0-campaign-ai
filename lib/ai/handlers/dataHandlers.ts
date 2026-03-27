import { useCampaignUIStore } from "@/store/useCampaignUIStore";
import { useAIAgentStore } from "@/store/useAIAgentStore";
import { ActionContext } from "../actionDispatcher";

export async function UPDATE_FORM(payload: any, context?: ActionContext) {
  useCampaignUIStore.getState().updateFormData(payload.data);

  // Sync to AIAgentStore for campaign forms
  const formIds = ['campaignForm', 'customiseForm', 'recipientsForm', 'deliveryForm', 'paymentForm'];
  const mappedData = {
    ...payload.data,
    campaignName: payload.data.name || payload.data.campaignName,
    messageContent: payload.data.message || payload.data.messageContent,
    sendDateTime: payload.data.date || payload.data.sendDateTime,
    paymentMethod: payload.data.method || payload.data.paymentMethod,
  };

  formIds.forEach(formId => {
    const currentData = useAIAgentStore.getState().forms[formId] || {};
    useAIAgentStore.getState().setForm(formId, { ...currentData, ...mappedData });
  });
}

export async function CREATE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}

export async function UPDATE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
}

export async function DELETE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}/${payload.id}`, {
    method: "DELETE",
  });
}

export async function FETCH_DATA(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}`);
}
