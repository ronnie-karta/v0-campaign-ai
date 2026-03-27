import { create } from "zustand";

type CampaignUIState = {
  activeView: string;
  formData: Record<string, any>;
  context: Record<string, any>;

  setActiveView: (view: string) => void;
  setFormData: (data: any) => void;
  updateFormData: (data: any) => void;
};

export const useCampaignUIStore = create<CampaignUIState>((set) => ({
  activeView: "campaignDashboard",
  formData: {},
  context: {},

  setActiveView: (view) => set({ activeView: view }),
  setFormData: (data) => set({ formData: data }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}));
