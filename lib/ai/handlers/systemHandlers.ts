import { runActions } from "../actionDispatcher";

export async function RUN_WORKFLOW(payload: any) {
  await fetch(`/api/workflow/${payload.workflow}`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}

export async function CONFIRMATION(payload: any) {
  const confirmed = window.confirm(payload.message);

  if (confirmed) {
    await runActions([payload.confirmAction]);
  }
}

export async function DOWNLOAD_FILE(payload: any) {
  const link = document.createElement("a");
  link.href = payload.url;
  link.download = payload.filename;
  link.click();
}
