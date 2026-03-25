"use client";

import { create } from "zustand";

interface UIState {
  modals: Record<string, { isOpen: boolean; data?: any }>;
  drawers: Record<string, { isOpen: boolean; data?: any }>;
  toasts: Array<{ message: string; type: "success" | "error" | "info" }>;
  campaignData: any;

  // Actions
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  openDrawer: (drawerId: string, data?: any) => void;
  closeDrawer: (drawerId: string) => void;
  openCampaign: (data?: any) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const useUIStore = create<UIState>((set) => ({
  modals: {},
  drawers: {},
  toasts: [],
  campaignData: null,

  openModal: (modalId, data) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: { isOpen: true, data } },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: { isOpen: false } },
    })),

  openDrawer: (drawerId, data) =>
    set((state) => ({
      drawers: { ...state.drawers, [drawerId]: { isOpen: true, data } },
    })),

  closeDrawer: (drawerId) =>
    set((state) => ({
      drawers: { ...state.drawers, [drawerId]: { isOpen: false } },
    })),

  openCampaign: (data) =>
    set({
      campaignData: data,
    }),

  showToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { message, type }],
    })),
}));
