import { ActionContext } from "../actionDispatcher";

export async function CREATE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}

export async function UPDATE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}/${payload.id}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
}

export async function DELETE_ENTITY(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}/${payload.id}`, {
    method: "DELETE",
  });
}

export async function FETCH_DATA(payload: any, context?: ActionContext) {
  await fetch(`/api/${payload.entity}`);
}
