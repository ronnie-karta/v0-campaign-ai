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
    const isCampaignPage = context?.currentPage?.startsWith("/campaign");

    const actions: Action[] = [];
    let chatResponse = "";
    let identified = false;

    // --- STEP 1: CAMPAIGN ---
    const budgetMatch = message.match(/(?:budget|with budget)\s*(?:\$|usd)?\s*(\d+(?:[.,]\d+)?)/i);
    const typeMatch = message.match(/\b(email|sms|both)\b/i);
    const descriptionMatch = message.match(/(?:about|described as|description:)\s+(.+?)(?:\s+with|\s+budget|\s*$)/i);

    let campaignName = "";
    const nameMatch = message.match(/(?:create|new)\s+(?:a\s+)?(?:new\s+)?(?:email|sms|both)?\s*campaign\s+(?:for\s+|called\s+)?(.+?)(?:\s+with|\s+budget|\s+about|\s+described|\s+description|\s*$)/i) ||
                     message.match(/set\s+campaign\s+name\s+to\s+(.+?)(?:\s+about|\s+described|\s+description|\s*$)/i) ||
                     message.match(/(.+?)\s+campaign(?:\s+about|\s+described|\s+description|\s+budget|\s+with|\s*$)/i);

    if (nameMatch) {
      campaignName = nameMatch[1].trim();
      campaignName = campaignName.replace(/^(for|called)\s+/i, "");
      const lowerName = campaignName.toLowerCase();
      if (lowerName === "new email" || lowerName === "new sms" || lowerName === "new") {
        campaignName = "";
      }
    }

    const isGenericCreate = messageLower === "create campaign" ||
                           messageLower === "create a campaign" ||
                           messageLower === "create a new campaign" ||
                           messageLower === "new campaign" ||
                           (messageLower.includes("create") && messageLower.includes("campaign") && !campaignName);

    if ((nameMatch || budgetMatch || typeMatch || descriptionMatch) && !isGenericCreate) {
      const name = campaignName ? toProperCase(campaignName) : "";
      const budget = budgetMatch ? parseFloat(budgetMatch[1].replace(",", "")) : undefined;
      const type = typeMatch ? typeMatch[1].toLowerCase() : undefined;
      const description = descriptionMatch ? descriptionMatch[1].trim() : undefined;

      chatResponse = "Got it. Let's set up your campaign.";

      if (!isCampaignPage) {
        actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
      }

      const formData: any = {};
      if (name) formData.name = name;
      if (budget) formData.budget = budget;
      if (type) formData.campaignType = type;
      if (description) formData.description = description;

      actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: formData } });
      actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 1 } });
      identified = true;
    } else if (isGenericCreate) {
      chatResponse = "Got it. Let's set up your campaign.";

      if (!isCampaignPage) {
        actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
      }

      actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: {} } });
      actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 1 } });
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
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: data } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 2 } });
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
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: data } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 3 } });
        identified = true;
      }
    }

    // --- STEP 4: DELIVERY ---
    if (!identified) {
      if (messageLower.includes("schedule") || messageLower.includes("tomorrow") || messageLower.includes("send immediately") || messageLower.includes("9am") || messageLower.includes("delivery")) {
        const data: any = {};
        if (messageLower.includes("tomorrow")) data.date = "2026-03-26";
        if (messageLower.includes("9am")) data.time = "09:00";
        if (messageLower.includes("immediately")) data.immediate = true;

        chatResponse = "Scheduling delivery.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: data } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 4 } });
        identified = true;
      }
    }

    // --- STEP 5: PAYMENT ---
    if (!identified) {
      if (messageLower.includes("pay") || messageLower.includes("card") || messageLower.includes("payment") || messageLower.includes("billing") || messageLower.includes("proceed to payment")) {
        const campaignData = {
          name: "Automated Summer Sale",
          type: "email",
          budget: 5000,
          sender: "Karta Marketing Team",
          subject: "Summer is here! Enjoy 30% off everything",
          recipients: 5,
          delivery: "2026-06-01 09:00",
          method: "Credit Card"
        };

        chatResponse = `I've set up everything for you and we're ready to proceed to payment.

**Summary of your campaign:**
- **Campaign**: ${campaignData.name} (${campaignData.type}, budget: $${campaignData.budget})
- **Creative**: Sender: ${campaignData.sender}, Subject: ${campaignData.subject}
- **Audience**: ${campaignData.recipients} recipients selected
- **Logistics**: Scheduled for ${campaignData.delivery}
- **Payment**: Ready with ${campaignData.method}

I've populated all details from Step 1 to Step 5 for you.`;

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        const allData = {
          name: campaignData.name,
          campaignType: campaignData.type,
          description: "A fully automated campaign to promote our summer collection with a 30% discount.",
          budget: campaignData.budget,
          senderName: campaignData.sender,
          senderEmail: "marketing@karta-ai.com",
          subject: campaignData.subject,
          messageContent: "Hi there! Summer has officially arrived, and we want you to celebrate in style. Use code SUMMER30 at checkout to get 30% off your entire order. Shop now and save big!",
          recipients: [
            { id: "r1", name: "Alice Johnson", email: "alice@example.com" },
            { id: "r2", name: "Bob Smith", email: "bob@example.com" },
            { id: "r3", name: "Charlie Brown", email: "charlie@example.com" },
            { id: "r4", name: "Diana Prince", email: "diana@example.com" },
            { id: "r5", name: "Edward Norton", email: "edward@example.com" }
          ],
          scheduleType: "scheduled",
          sendDateTime: "2026-06-01T09:00",
          timezone: "America/New_York",
          repeatFrequency: "once",
          paymentMethod: "credit-card",
          billingEmail: "billing@karta-ai.com",
          agreeToTerms: true
        };

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: allData } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 5 } });

        return Response.json({
          chat: chatResponse,
          actions: actions,
          mode: "plan",
          steps: [
            { id: "s1", description: "Identity & Goals configured", status: "completed" },
            { id: "s2", description: "Creative Content designed", status: "completed" },
            { id: "s3", description: "Target Audience selected", status: "completed" },
            { id: "s4", description: "Logistics & Delivery scheduled", status: "completed" },
            { id: "s5", description: "Final Review & Payment ready", status: "current" }
          ]
        });
      }
    }

    // --- AUTOMATION: FILL ALL DETAILS ---
    if (!identified) {
      if (messageLower.includes("automate full campaign") || messageLower.includes("fill all details") || messageLower.includes("automate campaign")) {
        const campaignData = {
          name: "Automated Summer Sale",
          type: "email",
          budget: 5000,
          sender: "Karta Marketing Team",
          subject: "Summer is here! Enjoy 30% off everything",
          recipients: 5,
          delivery: "2026-06-01 09:00",
          method: "Credit Card"
        };

        chatResponse = `I'm automating the entire campaign setup for you. All details from Step 1 to Step 5 are being populated.

**Summary of your campaign:**
- **Campaign**: ${campaignData.name} (${campaignData.type}, budget: $${campaignData.budget})
- **Creative**: Sender: ${campaignData.sender}, Subject: ${campaignData.subject}
- **Audience**: ${campaignData.recipients} recipients selected
- **Logistics**: Scheduled for ${campaignData.delivery}
- **Payment**: Ready with ${campaignData.method}

Proceeding to the final review step.`;

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        const allData = {
          name: campaignData.name,
          campaignType: campaignData.type,
          description: "A fully automated campaign to promote our summer collection with a 30% discount.",
          budget: campaignData.budget,
          senderName: campaignData.sender,
          senderEmail: "marketing@karta-ai.com",
          subject: campaignData.subject,
          messageContent: "Hi there! Summer has officially arrived, and we want you to celebrate in style. Use code SUMMER30 at checkout to get 30% off your entire order. Shop now and save big!",
          recipients: [
            { id: "r1", name: "Alice Johnson", email: "alice@example.com" },
            { id: "r2", name: "Bob Smith", email: "bob@example.com" },
            { id: "r3", name: "Charlie Brown", email: "charlie@example.com" },
            { id: "r4", name: "Diana Prince", email: "diana@example.com" },
            { id: "r5", name: "Edward Norton", email: "edward@example.com" }
          ],
          scheduleType: "scheduled",
          sendDateTime: "2026-06-01T09:00",
          timezone: "America/New_York",
          repeatFrequency: "once",
          paymentMethod: "credit-card",
          billingEmail: "billing@karta-ai.com",
          agreeToTerms: true
        };

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm", data: allData } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 5 } });

        return Response.json({
          chat: chatResponse,
          actions: actions,
          mode: "plan",
          steps: [
            { id: "s1", description: "Identity & Goals configured", status: "completed" },
            { id: "s2", description: "Creative Content designed", status: "completed" },
            { id: "s3", description: "Target Audience selected", status: "completed" },
            { id: "s4", description: "Logistics & Delivery scheduled", status: "completed" },
            { id: "s5", description: "Final Review & Payment ready", status: "current" }
          ]
        });
      }
    }

    // --- MISC / NAVIGATION ---
    if (!identified) {
      if (messageLower.includes("review campaign")) {
        chatResponse = "Let's review your campaign.";

        if (!isCampaignPage) {
          actions.push({ type: "NAVIGATE", payload: { url: "/campaigns" } });
        }

        actions.push({ type: "OPEN_VIEW", payload: { target: "campaignForm" } });
        actions.push({ type: "SET_STATE", payload: { key: "campaignStep", value: 5 } });
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
        actions: [{ type: "OPEN_MODAL", payload: { modalId: "quick-actions", data: {} } }]
      });
    }

    return Response.json({ chat: chatResponse, actions: actions });

  } catch (error) {
    console.error("Chat mock API error:", error);
    return Response.json(
      { chat: "Sorry, I encountered an error processing your request.", actions: [] },
      { status: 500 }
    );
  }
}
