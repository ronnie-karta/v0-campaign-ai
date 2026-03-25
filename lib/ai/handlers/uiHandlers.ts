import { useUIStore } from "@/store/useUIStore";

export async function OPEN_MODAL(payload: any) {
  useUIStore.getState().openModal(payload.modalId, payload.data);
}

export async function CLOSE_MODAL(payload: any) {
  useUIStore.getState().closeModal(payload.modalId);
}

export async function NAVIGATE(payload: any) {
  window.location.href = payload.route;
}

export async function OPEN_CAMPAIGN(payload: any) {
  useUIStore.getState().openCampaign(payload.data);
}

export async function OPEN_DRAWER(payload: any) {
  useUIStore.getState().openDrawer(payload.drawerId, payload.data);
}

export async function SHOW_TOAST(payload: any) {
  useUIStore.getState().showToast(payload.message, payload.type);
}
