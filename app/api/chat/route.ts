import { Action } from "@/lib/types";

interface ChatRequest {
  message: string;
  messages: Array<{ role: string; content: string }>;
  context?: {
    currentPage: string;
    activeForm: string;
    currentStep: number;
    formData: any;
  };
}

function toProperCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { message, context } = body;
    const messageLower = message.toLowerCase().trim();
    const isCampaignPage = context?.currentPage?.includes("/campaigns/create");

    const actions: Action[] = [];
    let chatResponse = "";
    let identified = false;

    // --- STEP 1: CAMPAIGN ---
    const campaignMatch = message.match(/create\s+(?:a\s+)?(?:new\s+)?campaign\s+(.+)/i) ||
                         message.match(/set\s+campaign\s+name\s+to\s+(.+)/i) ||
                         message.match(/(?:create\s+)?([a-zA-Z0-9\s]+)\s+campaign/i);

    // Explicitly check if the message is ONLY "create campaign" or similar
    const isGenericCreate = messageLower === "create campaign" ||
                           messageLower === "create a campaign" ||
                           messageLower === "create a new campaign" ||
                           messageLower === "new campaign";

    if (campaignMatch && !isGenericCreate) {
      const name = toProperCase(campaignMatch[1].trim());
      chatResponse = "Got it. Let's set up your campaign.";

      if (!isCampaignPage) {
        actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
      }

      actions.push({
        type: "SET_STATE",
        payload: { key: "campaignStep", value: 1 }
      });
      actions.push({
        type: "SET_FORM",
        payload: {
          formId: "campaignForm",
          data: { name }
        }
      });
      identified = true;
    } else if (isGenericCreate) {
       chatResponse = "Got it. Let's set up your campaign.";

       if (!isCampaignPage) {
        actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
      }

       actions.push({
        type: "SET_STATE",
        payload: { key: "campaignStep", value: 1 }
      });
      actions.push({
        type: "SET_FORM",
        payload: {
          formId: "campaignForm",
          data: {}
        }
      });
      identified = true;
    }

    // --- STEP 2: CUSTOMISE ---
    if (!identified) {
      const templateMatch = message.match(/use\s+(?:email\s+)?template\s+(.+)/i);
      const themeMatch = message.match(/apply\s+(.+)\s+theme/i) || message.match(/use\s+(.+)\s+theme/i);

      if (templateMatch || themeMatch || messageLower.includes("customise") || messageLower.includes("customize")) {
        const data: any = {};
        if (templateMatch) data.template = templateMatch[1].trim();
        if (themeMatch) data.theme = themeMatch[1].trim();

        chatResponse = "Customizing your campaign.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
        }

        actions.push({
          type: "SET_STATE",
          payload: { key: "campaignStep", value: 2 }
        });
        actions.push({
          type: "SET_FORM",
          payload: {
            formId: "customiseForm",
            data: data
          }
        });
        identified = true;
      }
    }

    // --- STEP 3: RECIPIENTS ---
    if (!identified) {
      if (messageLower.includes("send to all customers") || messageLower.includes("upload recipient list") || messageLower.includes("recipients")) {
        const data: any = {};
        if (messageLower.includes("all customers")) data.segment = "all_customers";

        chatResponse = "Setting recipients.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
        }

        actions.push({
          type: "SET_STATE",
          payload: { key: "campaignStep", value: 3 }
        });
        actions.push({
          type: "SET_FORM",
          payload: {
            formId: "recipientsForm",
            data: data
          }
        });
        identified = true;
      }
    }

    // --- STEP 4: DELIVERY ---
    if (!identified) {
      if (messageLower.includes("schedule") || messageLower.includes("tomorrow") || messageLower.includes("send immediately") || messageLower.includes("9am") || messageLower.includes("delivery")) {
        const data: any = {};
        if (messageLower.includes("tomorrow")) data.date = "2026-03-26"; // Mock tomorrow
        if (messageLower.includes("9am")) data.time = "09:00";
        if (messageLower.includes("immediately")) data.immediate = true;

        chatResponse = "Scheduling delivery.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
        }

        actions.push({
          type: "SET_STATE",
          payload: { key: "campaignStep", value: 4 }
        });
        actions.push({
          type: "SET_FORM",
          payload: {
            formId: "deliveryForm",
            data: data
          }
        });
        identified = true;
      }
    }

    // --- STEP 5: PAYMENT ---
    if (!identified) {
      if (messageLower.includes("pay") || messageLower.includes("card") || messageLower.includes("payment") || messageLower.includes("billing") || messageLower.includes("proceed to payment")) {
        const data: any = {};
        if (messageLower.includes("card")) data.method = "card";

        chatResponse = "Proceeding to payment.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
        }

        actions.push({
          type: "SET_STATE",
          payload: { key: "campaignStep", value: 5 }
        });
        actions.push({
          type: "SET_FORM",
          payload: {
            formId: "paymentForm",
            data: data
          }
        });
        identified = true;
      }
    }

    // --- MISC / NAVIGATION ---
    if (!identified) {
      if (messageLower.includes("review campaign")) {
        chatResponse = "Let's review your campaign.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
        }

        actions.push({
          type: "SET_STATE",
          payload: { key: "campaignStep", value: 5 }
        });
        identified = true;
      } else if (messageLower.includes("reset campaign")) {
        chatResponse = "Campaign reset.";
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 1 } });
        actions.push({ type: "RESET_FORM", payload: { formId: "campaignForm" } });
        actions.push({ type: "RESET_FORM", payload: { formId: "customiseForm" } });
        actions.push({ type: "RESET_FORM", payload: { formId: "recipientsForm" } });
        actions.push({ type: "RESET_FORM", payload: { formId: "deliveryForm" } });
        actions.push({ type: "RESET_FORM", payload: { formId: "paymentForm" } });
        identified = true;
      }
    }

    // --- FALLBACK ---
    if (!identified) {
      return Response.json({
        chat: "What would you like to do?",
        actions: [
          {
            type: "OPEN_MODAL",
            payload: {
              modalId: "quick-actions",
              data: {}
            }
          }
        ]
      });
    }

    return Response.json({
      chat: chatResponse,
      actions: actions
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { chat: "Sorry, I encountered an error processing your request.", actions: [] },
      { status: 500 }
    );
  }
}
