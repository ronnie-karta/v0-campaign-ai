"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Message, ChatResponse, Action } from "@/lib/types";

interface AIAgentState {
  sessionId: string;
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  actionQueue: Action[];
  forms: Record<string, any>;
  state: Record<string, any>;

  // Actions
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (isOpen: boolean) => void;
  setActiveModal: (modalId: string | null, data?: Record<string, unknown>) => void;
  clearMessages: () => void;
  addToActionQueue: (action: Action) => void;
  clearActionQueue: () => void;
  set: (key: string, value: any) => void;
  setForm: (formId: string, data: any) => void;
  resetForm: (formId: string) => void;
}

const STEP_FORM_MAP: Record<number, string> = {
  1: "campaignForm",
  2: "customiseForm",
  3: "recipientsForm",
  4: "deliveryForm",
  5: "paymentForm",
};

export const useAIAgentStore = create<AIAgentState>()(
  persist(
    (set) => ({
      sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      messages: [],
      isLoading: false,
      isOpen: false,
      activeModal: null,
      modalData: null,
      actionQueue: [],
      forms: {},
      state: {},

      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setLoading: (loading: boolean) =>
        set({
          isLoading: loading,
        }),

      setOpen: (isOpen: boolean) =>
        set({
          isOpen,
        }),

      setActiveModal: (modalId: string | null, data?: Record<string, unknown>) =>
        set({
          activeModal: modalId,
          modalData: data || null,
        }),

      clearMessages: () =>
        set({
          messages: [],
        }),

      addToActionQueue: (action: Action) =>
        set((state) => ({
          actionQueue: [...state.actionQueue, action],
        })),

      clearActionQueue: () =>
        set({
          actionQueue: [],
        }),

      set: (key: string, value: any) =>
        set((state) => ({
          state: { ...state.state, [key]: value },
        })),

      setForm: (formId: string, data: any) =>
        set((state) => ({
          forms: { ...state.forms, [formId]: data },
        })),

      resetForm: (formId: string) =>
        set((state) => {
          const newForms = { ...state.forms };
          delete newForms[formId];
          return { forms: newForms };
        }),
    }),
    {
      name: "ai-agent-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        isOpen: state.isOpen,
        forms: state.forms,
        state: state.state,
      }),
    }
  )
);

// Custom hook to expose simplified API
export const useAIAgent = () => {
  const store = useAIAgentStore();

  const sendMessage = async (text: string) => {
    // Add user message immediately (optimistic UI)
    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    store.addMessage(userMessage);
    store.setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: store.sessionId,
          context: {
            currentPage: window.location.pathname,
            activeForm: STEP_FORM_MAP[store.state.campaignStep || 1],
            currentStep: store.state.campaignStep || 1,
            formData: store.forms[STEP_FORM_MAP[store.state.campaignStep || 1]] || {},
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get chat response");
      }

      const data: ChatResponse = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "assistant",
        content: data.chat || data.message || "",
        timestamp: Date.now(),
        mode: data.mode,
        steps: data.steps,
      };

      store.addMessage(assistantMessage);

      // Queue actions for processing
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach((action) => {
          store.addToActionQueue(action);
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again later.",
        timestamp: Date.now(),
      };
      store.addMessage(errorMessage);
    } finally {
      store.setLoading(false);
    }
  };

  return {
    sendMessage,
    messages: store.messages,
    isLoading: store.isLoading,
    isOpen: store.isOpen,
    setOpen: store.setOpen,
    activeModal: store.activeModal,
    modalData: store.modalData,
    setActiveModal: store.setActiveModal,
    actionQueue: store.actionQueue,
    clearActionQueue: store.clearActionQueue,
    addToActionQueue: store.addToActionQueue,
    set: store.set,
    setForm: store.setForm,
    resetForm: store.resetForm,
    state: store.state,
    forms: store.forms,
  };
};
