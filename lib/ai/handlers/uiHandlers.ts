import { useUIStore } from "@/store/useUIStore";
import { useCampaignUIStore } from "@/store/useCampaignUIStore";
import { useAIAgentStore } from "@/store/useAIAgentStore";
import { ActionContext } from "../actionDispatcher";
import { toast } from "@/hooks/use-toast";

export async function OPEN_VIEW(payload: any, context?: ActionContext) {
  useCampaignUIStore.getState().setActiveView(payload.target);
  if (payload.data) {
    useCampaignUIStore.getState().setFormData(payload.data);

    // If it's the campaign form, also update the AIAgentStore to pre-fill the form
    if (payload.target === 'campaignForm') {
      const formIds = ['campaignForm', 'customiseForm', 'recipientsForm', 'deliveryForm', 'paymentForm'];
      const mappedData = {
        ...payload.data,
        campaignName: payload.data.name || payload.data.campaignName,
        messageContent: payload.data.message || payload.data.messageContent,
        sendDateTime: payload.data.date || payload.data.sendDateTime,
        paymentMethod: payload.data.method || payload.data.paymentMethod,
      };

      // For simplicity, we merge the data into all campaign form parts
      formIds.forEach(formId => {
        const currentData = useAIAgentStore.getState().forms[formId] || {};
        useAIAgentStore.getState().setForm(formId, { ...currentData, ...mappedData });
      });
    }
  }
}

export async function OPEN_MODAL(payload: any, context?: ActionContext) {
  const modalId = payload.modalId || payload.modal;
  const data = payload.data || payload.prefill;
  useUIStore.getState().openModal(modalId, data);
}

export async function CLOSE_MODAL(payload: any, context?: ActionContext) {
  useUIStore.getState().closeModal(payload.modalId);
}

export async function NAVIGATE(payload: any, context?: ActionContext) {
  const url = payload.url;
  if (context?.router) {
    context.router.push(url);
  } else {
    window.location.href = url;
  }
}

export async function OPEN_CAMPAIGN(payload: any, context?: ActionContext) {
  if (context?.router) {
    context.router.push("/campaigns/create");
  } else {
    window.location.href = "/campaigns/create";
  }
}

export async function OPEN_DRAWER(payload: any, context?: ActionContext) {
  useUIStore.getState().openDrawer(payload.drawerId, payload.data);
}

export async function SHOW_TOAST(payload: any, context?: ActionContext) {
  toast({
    title: payload.type === 'error' ? 'Error' : payload.type === 'success' ? 'Success' : 'Notification',
    description: payload.message,
    variant: payload.type === 'error' ? 'destructive' : 'default',
  });
}
