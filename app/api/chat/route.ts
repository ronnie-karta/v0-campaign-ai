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
    // Improved extraction logic
    const budgetMatch = message.match(/budget\s*(?:\$|usd)?\s*(\d+(?:[.,]\d+)?)/i);
    const typeMatch = message.match(/\b(email|sms|both)\b/i);

    let campaignName = "";
    const nameMatch = message.match(/(?:create|new)\s+(?:a\s+)?(?:new\s+)?(?:email|sms|both)?\s*campaign\s+(?:for\s+|called\s+)?(.+?)(?:\s+with|\s+budget|\s*$)/i) ||
                     message.match(/set\s+campaign\s+name\s+to\s+(.+)/i) ||
                     message.match(/(.+)\s+campaign/i);

    if (nameMatch) {
      campaignName = nameMatch[1].trim();
      // Remove "for " or "called " if it was captured at the start
      campaignName = campaignName.replace(/^(for|called)\s+/i, "");
      // Prevent capturing common words as campaign names
      const lowerName = campaignName.toLowerCase();
      if (lowerName === "new email" || lowerName === "new sms" || lowerName === "new") {
        campaignName = "";
      }
    }

    // Explicitly check if the message is ONLY "create campaign" or similar
    const isGenericCreate = messageLower === "create campaign" ||
                           messageLower === "create a campaign" ||
                           messageLower === "create a new campaign" ||
                           messageLower === "new campaign" ||
                           (messageLower.includes("create") && messageLower.includes("campaign") && !campaignName);

    if ((nameMatch || budgetMatch || typeMatch) && !isGenericCreate) {
      const name = campaignName ? toProperCase(campaignName) : "";
      const budget = budgetMatch ? parseFloat(budgetMatch[1].replace(",", "")) : undefined;
      const type = typeMatch ? typeMatch[1].toLowerCase() : undefined;

      chatResponse = "Got it. Let's set up your campaign.";

      if (!isCampaignPage) {
        actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
      }

      actions.push({
        type: "SET_STATE",
        payload: { key: "campaignStep", value: 1 }
      });

      const formData: any = {};
      if (name) {
        formData.name = name;
        formData.campaignName = name;
      }
      if (budget) formData.budget = budget;
      if (type) formData.campaignType = type;

      actions.push({
        type: "SET_FORM",
        payload: {
          formId: "campaignForm",
          data: formData
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
