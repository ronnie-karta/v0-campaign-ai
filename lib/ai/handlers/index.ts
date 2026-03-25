import { Action } from "../../types";
import * as ui from "./uiHandlers";
import * as state from "./stateHandlers";
import * as data from "./dataHandlers";
import * as system from "./systemHandlers";

export const actionHandlers: Record<
  Action["type"],
  (payload: any) => Promise<void>
> = {
  ...ui,
  ...state,
  ...data,
  ...system,
};
