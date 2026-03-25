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

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { message, context } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const messageLower = message.toLowerCase();
    let response: ChatResponse;

    // --- STEP-DRIVEN LOGIC (JULES) ---
    if (context?.currentPage === "/campaigns/create") {
      const currentStep = context.currentStep || 1;

      // Step 1: Basic Info (name, budget)
      if (currentStep === 1 && (messageLower.includes("nike") || messageLower.includes("adidas") || messageLower.includes("campaign") || messageLower.includes("budget"))) {
        const name = messageLower.includes("nike") ? "Nike Campaign" : messageLower.includes("adidas") ? "Adidas Campaign" : (context.formData.campaignName || "New Campaign");
        const budgetMatch = messageLower.match(/\d+/);
        const budget = budgetMatch ? parseInt(budgetMatch[0]) : (context.formData.budget || 1000);

        response = {
          mode: "complete",
          chat: `I've updated the campaign details for "${name}" with a budget of ${budget}. Moving you to the Audience step.`,
          actions: [
            {
              type: "SET_FORM",
              payload: {
                formId: "campaignForm",
                data: {
                  ...context.formData,
                  campaignName: name,
                  budget: budget,
                  campaignType: "email",
                  description: `AI generated campaign for ${name}`,
                },
              },
            },
            {
              type: "SET_STATE",
              payload: {
                key: "campaignStep",
                value: 2,
              },
            },
          ],
        };
        return Response.json(response);
      }

      // Step 2: Audience
      if (currentStep === 2 && (messageLower.includes("target") || messageLower.includes("audience") || messageLower.includes("athletes") || messageLower.includes("recipient") || messageLower.includes("add"))) {
        const audience = messageLower.includes("athletes") ? "Young athletes" : "Target Audience";
        const email = "target@example.com";
        
        response = {
          mode: "complete",
          chat: `Added ${audience} (${email}) to your recipients. Now let's customize your message content.`,
          actions: [
            {
              type: "SET_FORM",
              payload: {
                formId: "campaignForm",
                data: {
                  ...context.formData,
                  recipients: [
                    ...(context.formData.recipients || []),
                    { id: `rec-${Date.now()}`, name: audience, email: email }
                  ],
                },
              },
            },
            {
              type: "SET_STATE",
              payload: {
                key: "campaignStep",
                value: 3,
              },
            },
          ],
        };
        return Response.json(response);
      }

      // Step 3: Content
      if (currentStep === 3 && (messageLower.includes("message") || messageLower.includes("content") || messageLower.includes("text") || messageLower.includes("write"))) {
        const content = messageLower.includes("nike") ? "Just Do It. New collection arriving soon." : "Elevate your game with our latest arrivals.";
        
        response = {
          mode: "complete",
          chat: "I've drafted your campaign message. We can now move to delivery settings.",
          actions: [
            {
              type: "SET_FORM",
              payload: {
                formId: "campaignForm",
                data: {
                  ...context.formData,
                  senderName: "Karta AI Agent",
                  senderEmail: "ai@karta.com",
                  messageContent: content,
                  subject: "Exclusive Update from Karta AI",
                },
              },
            },
            {
              type: "SET_STATE",
              payload: {
                key: "campaignStep",
                value: 4,
              },
            },
          ],
        };
        return Response.json(response);
      }
    }

    // --- PLAN MODE ---
    if (messageLower.includes("create") && messageLower.includes("campaign") && !context?.currentPage.includes("create")) {
      response = {
        mode: "plan",
        chat: "I'll guide you through creating your campaign in three main phases:",
        steps: [
          { id: "1", description: "Set basic info (name, budget)", status: "pending" },
          { id: "2", description: "Define your target audience", status: "pending" },
          { id: "3", description: "Customize campaign content", status: "pending" },
        ],
        actions: [
          {
            type: "NAVIGATE",
            payload: {
              url: "/campaigns/create",
            },
          },
        ],
      };
      return Response.json(response);
    }

    // --- GENERAL INTENTS (MATCHED TO JULES ACTIONS) ---
    if (messageLower.includes("help")) {
      response = {
        mode: "complete",
        chat: "I'm Jules, your Karta AI assistant. I can help you create campaigns, navigate the app, or manage your data.",
        actions: [
          {
            type: "OPEN_MODAL",
            payload: {
              modal: "help-modal",
              prefill: { title: "Help", content: "Try saying 'create campaign' or 'go to campaigns'." }
            }
          }
        ]
      };
    } else if (messageLower.includes("navigate") || messageLower.includes("go to")) {
      const target = messageLower.includes("campaign") ? "/campaigns" : "/";
      response = {
        mode: "complete",
        chat: `Navigating to ${target === "/campaigns" ? "Campaigns" : "Dashboard"}.`,
        actions: [{ type: "NAVIGATE", payload: { url: target } }]
      };
    } else if (messageLower.includes("hello") || messageLower.includes("hi")) {
      response = {
        mode: "complete",
        chat: "Hello! I'm Jules. Ready to start a new campaign?",
        actions: [
          {
            type: "CONFIRMATION",
            payload: {
              message: "Would you like to start a new campaign right now?",
              nextAction: { type: "OPEN_CAMPAIGN", payload: {} }
            }
          }
        ]
      };
    } else {
      // Default fallback
      response = {
        mode: "complete",
        chat: "I'm not sure how to help with that. Would you like to create a campaign?",
        actions: [
          {
            type: "OPEN_MODAL",
            payload: { modal: "quick-actions", prefill: {} }
          }
        ]
      };
    }

    return Response.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { mode: "complete", chat: "Sorry, I encountered an error processing your request." },
      { status: 500 }
    );
  }
}
