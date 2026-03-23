"use client";

import { useAIAgent as useAIAgentStore } from "@/store/useAIAgentStore";
import { useRouter } from "next/navigation";
import { processActionQueue } from "@/lib/actionDispatcher";
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
      processActionQueue(router);
    }
  }, [aiAgent.actionQueue, router]);

  return {
    sendMessage: aiAgent.sendMessage,
    messages: aiAgent.messages,
    isLoading: aiAgent.isLoading,
    isOpen: aiAgent.isOpen,
    setOpen: aiAgent.setOpen,
    activeModal: aiAgent.activeModal,
    modalData: aiAgent.modalData,
    setActiveModal: aiAgent.setActiveModal,
  };
};
