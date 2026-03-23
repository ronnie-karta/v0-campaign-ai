import { Action } from "./types";
import { useAIAgentStore } from "@/store/useAIAgentStore";

export const dispatchAction = (action: Action, router?: any) => {
  const store = useAIAgentStore.getState();

  switch (action.type) {
    case "OPEN_MODAL": {
      const modalId = action.payload?.modalId as string;
      const modalData = action.payload?.data;
      store.setActiveModal(modalId, modalData);
      break;
    }

    case "NAVIGATE": {
      if (!router) {
        console.warn("Router not provided for NAVIGATE action");
        return;
      }
      const path = action.payload?.path as string;
      if (path) {
        router.push(path);
      }
      break;
    }

    case "SET_STATE": {
      const key = action.payload?.key as string;
      const value = action.payload?.value;
      // This could be extended to set arbitrary state
      // For now, we focus on modal state
      if (key === "modal") {
        store.setActiveModal(null);
      }
      break;
    }

    default:
      console.warn(`Unknown action type: ${(action as any).type}`);
  }
};

export const processActionQueue = (router?: any) => {
  const store = useAIAgentStore.getState();
  const actions = store.actionQueue;

  actions.forEach((action) => {
    dispatchAction(action, router);
  });

  store.clearActionQueue();
};
