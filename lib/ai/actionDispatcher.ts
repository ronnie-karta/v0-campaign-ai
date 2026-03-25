import { Action } from "../types";
import { actionHandlers } from "./handlers";

export async function runActions(actions: Action[]) {
  for (const action of actions) {
    const handler = (actionHandlers as any)[action.type];

    if (!handler) {
      console.warn("No handler for action:", action.type);
      continue;
    }

    try {
      await handler(action.payload);
    } catch (error) {
      console.error(`Error handling action ${action.type}`, error);
    }
  }
}
