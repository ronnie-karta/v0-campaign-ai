import { runActions, ActionContext } from "../actionDispatcher";

export async function RUN_WORKFLOW(payload: any, context?: ActionContext) {
  await fetch(`/api/workflow/${payload.workflow}`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}

export async function CONFIRMATION(payload: any, context?: ActionContext) {
  const confirmed = window.confirm(payload.message);

  if (confirmed) {
    await runActions([payload.confirmAction], context);
  }
}

export async function DOWNLOAD_FILE(payload: any, context?: ActionContext) {
  const link = document.createElement("a");
  link.href = payload.url;
  link.download = payload.filename;
  link.click();
}
