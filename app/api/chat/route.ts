import { ChatResponse, Action } from "@/lib/types";

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

    // 1. Data Extraction
    const extractedData: Record<string, any> = {};
    let targetStep = context?.currentStep || 1;

    // Name extraction
    const nameMatch = message.match(/(?:create\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+campaign/i);
    const genericNameMatch = message.match(/(?:create\s+)?([\w\s]+)\s+campaign/i);
    
    if (nameMatch) {
      extractedData.campaignName = nameMatch[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') + " Campaign";
      targetStep = 1;
    } else if (genericNameMatch && !messageLower.includes("create campaign") && !messageLower.includes("new campaign") && !messageLower.includes("navigate") && !messageLower.includes("go to")) {
      extractedData.campaignName = toProperCase(genericNameMatch[1].trim()) + " Campaign";
      targetStep = 1;
    } else if (messageLower.includes("nike")) {
      extractedData.campaignName = "Nike Campaign";
      targetStep = 1;
    } else if (messageLower.includes("adidas")) {
      extractedData.campaignName = "Adidas Campaign";
      targetStep = 1;
    }

    // Budget extraction
    const budgetMatch = message.match(/budget\s*(?:\$|usd|of\s*)?\s*(\d+)|(\d+)\s*budget/i);
    if (budgetMatch) {
      extractedData.budget = parseInt(budgetMatch[1] || budgetMatch[2]);
      targetStep = 1;
    } else {
      const genericNumberMatch = message.match(/\$(\d+)/);
      if (genericNumberMatch) {
        extractedData.budget = parseInt(genericNumberMatch[1]);
        targetStep = 1;
      }
    }

    // Message/Content extraction
    const messageMatch = message.match(/(?:set\s+)?(?:message|content|text)\s*(?::|is)?\s*(.+)/i);
    if (messageMatch) {
      extractedData.messageContent = messageMatch[1].trim();
      extractedData.senderName = context?.formData?.senderName || "Karta AI Agent";
      extractedData.senderEmail = context?.formData?.senderEmail || "ai@karta.com";
      targetStep = 3;
    } else if (messageLower.includes("promo") || messageLower.includes("sale") || messageLower.includes("off")) {
       if (!nameMatch && !budgetMatch && !messageLower.includes("schedule")) {
         extractedData.messageContent = toProperCase(message);
         targetStep = 3;
       }
    }

    // Recipients extraction
    const recipientsMatch = message.match(/(\d+)\s*(?:users|recipients|people|customers)/i);
    if (recipientsMatch) {
      const count = parseInt(recipientsMatch[1]);
      const mockRecipients = Array.from({ length: Math.min(count, 5) }, (_, i) => ({
        id: `rec-${Date.now()}-${i}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));
      extractedData.recipients = mockRecipients;
      targetStep = 2;
    }

    // Schedule/Date extraction
    if (messageLower.includes("schedule") || messageLower.includes("tomorrow") || messageLower.includes("send on") || messageLower.includes("delivery")) {
      let date = "2026-03-26";
      const dateMatch = message.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) date = dateMatch[1];
      
      extractedData.scheduleType = "scheduled";
      extractedData.sendDateTime = date;
      targetStep = 4;
    }

    // Payment extraction
    if (messageLower.includes("pay") || messageLower.includes("credit card") || messageLower.includes("billing") || messageLower.includes("payment")) {
      if (messageLower.includes("credit card")) extractedData.paymentMethod = "credit-card";
      const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      if (emailMatch) extractedData.billingEmail = emailMatch[1];
      targetStep = 5;
    }

    // 2. CONTEXT-AWARE LOGIC & PLAN MODE
    
    let chatMessage = "I've updated your campaign details.";
    let actions: Action[] = [];
    let mode: "complete" | "plan" = "complete";
    let steps: any[] = [];

    if (messageLower.includes("create") && messageLower.includes("campaign") && context?.currentPage !== "/campaigns/create") {
      mode = "plan";
      chatMessage = "I'll guide you through creating your campaign in three main phases:";
      steps = [
        { id: "1", description: "Set basic info (name, budget)", status: "pending" },
        { id: "2", description: "Define your target audience", status: "pending" },
        { id: "3", description: "Customize campaign content", status: "pending" },
      ];
      actions.push({ type: "NAVIGATE", payload: { url: "/campaigns/create" } });
    } else if (messageLower.includes("help")) {
      chatMessage = "I'm Jules, your Karta AI assistant. I can help you create campaigns, navigate the app, or manage your data.";
      actions.push({
        type: "OPEN_MODAL",
        payload: {
          modal: "help-modal",
          prefill: { title: "Help", content: "Try saying 'create campaign' or 'go to campaigns'." }
        }
      });
    } else if (messageLower.includes("navigate") || messageLower.includes("go to")) {
      const target = messageLower.includes("campaign") ? "/campaigns" : "/";
      chatMessage = `Navigating to ${target === "/campaigns" ? "Campaigns" : "Dashboard"}.`;
      actions.push({ type: "NAVIGATE", payload: { url: target } });
    } else if (messageLower.includes("hello") || messageLower.includes("hi")) {
      chatMessage = "Hello! I'm Jules. Ready to start a new campaign?";
      actions.push({
        type: "CONFIRMATION",
        payload: {
          message: "Would you like to start a new campaign right now?",
          nextAction: { type: "NAVIGATE", payload: { url: "/campaigns/create" } }
        }
      });
    } else if (Object.keys(extractedData).length > 0) {
      actions.push({
        type: "SET_FORM",
        payload: {
          formId: "campaignForm",
          data: { ...context?.formData, ...extractedData }
        }
      });
      actions.push({
        type: "SET_STATE",
        payload: { key: "campaignStep", value: targetStep }
      });
      const fields = Object.keys(extractedData).join(", ");
      chatMessage = `Got it — updated ${fields}. Moving to step ${targetStep}.`;
    } else {
      chatMessage = "I'm not sure how to help with that. Would you like to create a campaign?";
      actions.push({ type: "OPEN_MODAL", payload: { modal: "quick-actions", prefill: {} } });
    }

    const response: ChatResponse = {
      mode,
      chat: chatMessage,
      actions,
      ...(mode === "plan" ? { steps } : {})
    };

    return Response.json(response);

  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { mode: "complete", chat: "Sorry, I encountered an error processing your request.", actions: [] },
      { status: 500 }
    );
  }
}
