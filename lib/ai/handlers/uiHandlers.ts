import { useUIStore } from "@/store/useUIStore";
import { ActionContext } from "../actionDispatcher";

export async function OPEN_MODAL(payload: any, context?: ActionContext) {
  useUIStore.getState().openModal(payload.modal, payload.prefill);
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
  useUIStore.getState().showToast(payload.message, payload.type);
}
