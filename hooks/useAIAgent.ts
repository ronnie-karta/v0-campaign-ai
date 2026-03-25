"use client";

import { useAIAgent as useAIAgentStore } from "@/store/useAIAgentStore";
import { useRouter } from "next/navigation";
import { runActions } from "@/lib/ai/actionDispatcher";
import { useEffect } from "react";

/**
 * Custom hook to use AI Agent functionality
 * Handles message sending, state management, and action processing
 */
export const useAIAgent = () => {
  const router = useRouter();
  const aiAgent = useAIAgentStore();

  // Process action queue whenever it updates
  useEffect(() => {
    if (aiAgent.actionQueue.length > 0) {
      const processActions = async () => {
        const actions = [...aiAgent.actionQueue];
        aiAgent.clearActionQueue();
        await runActions(actions, { router });
      };
      processActions();
    }
  }, [aiAgent.actionQueue, aiAgent, router]);

  return {
    sendMessage: aiAgent.sendMessage,
    messages: aiAgent.messages,
    isLoading: aiAgent.isLoading,
    isOpen: aiAgent.isOpen,
    setOpen: aiAgent.setOpen,
    activeModal: aiAgent.activeModal,
    modalData: aiAgent.modalData,
    setActiveModal: aiAgent.setActiveModal,
    state: aiAgent.state,
    forms: aiAgent.forms,
    set: aiAgent.set,
    setForm: aiAgent.setForm,
    resetForm: aiAgent.resetForm,
  };
};
