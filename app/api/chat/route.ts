import { ChatResponse } from "@/lib/types";

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

const mockResponses: Record<string, ChatResponse> = {
  help: {
    message: "I can help you with various tasks. Try asking me about features, navigation, campaigns, or any specific questions you have!",
    intent: "GET_HELP",
    confidence: 0.95,
    entities: {},
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modal: "help-modal",
          prefill: {
            title: "Help",
            content: "I can help you with features, navigation, and campaigns.",
          },
        },
      },
    ],
  },
  hello: {
    message: "Hello! I'm your Karta AI Assistant. How can I help you today?",
    intent: "GREETING",
    confidence: 1.0,
    entities: {},
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modal: "quick-actions",
          prefill: {
            title: "Quick Actions",
            content: "Do you want to create a campaign or view existing ones?",
          },
        },
      },
    ],
  },
  features: {
    message: "Karta AI offers AI-powered chat assistance, smart actions, and modal interactions. You can ask me anything and I'll help guide you through the app!",
    intent: "GET_FEATURES",
    confidence: 0.9,
    entities: {},
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modal: "features-modal",
          prefill: {
            title: "Features",
            content:
              "Karta AI includes: Real-time chat assistance, Action dispatching system, Global state management, and extensible architecture.",
            actionText: "Got it",
          },
        },
      },
    ],
  },
  campaign: {
    message: "I'll help you create a new email or SMS campaign. Let me open the campaign creation wizard for you.",
    intent: "CREATE_CAMPAIGN",
    confidence: 0.85,
    entities: {},
    actions: [
      {
        type: "NAVIGATE",
        payload: {
          url: "/campaigns/create",
        },
      },
    ],
  },
  "create campaign": {
    message: "Great! Let's create a new campaign. I'm opening the campaign builder for you. You can set up your email or SMS campaign in just 5 simple steps.",
    intent: "CREATE_CAMPAIGN",
    confidence: 1.0,
    entities: {},
    actions: [
      {
        type: "NAVIGATE",
        payload: {
          url: "/campaigns/create",
        },
      },
    ],
  },
  "new campaign": {
    message: "Perfect! I'm launching the campaign creation wizard. You'll be able to configure your message, recipients, delivery schedule, and payment in a guided workflow.",
    intent: "CREATE_CAMPAIGN",
    confidence: 1.0,
    entities: {},
    actions: [
      {
        type: "NAVIGATE",
        payload: {
          url: "/campaigns/create",
        },
      },
    ],
  },
  navigate: {
    message: "I can help you navigate to different pages. Where would you like to go?",
    intent: "NAVIGATE",
    confidence: 0.8,
    entities: {
      target: "campaigns"
    },
    actions: [
      {
        type: "NAVIGATE",
        payload: {
          url: "/campaigns",
        },
      },
    ],
  },
  default: {
    message: "Do you want to create a campaign or view existing ones?",
    intent: "UNKNOWN",
    confidence: 0.5,
    entities: {},
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modal: "quick-actions",
          prefill: {},
        },
      },
    ],
  },
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { message, context } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const messageLower = message.toLowerCase();
    let response: ChatResponse;

    // --- STEP-DRIVEN LOGIC ---
    if (context?.currentPage === "/campaigns/create") {
      const currentStep = context.currentStep || 1;

      if (currentStep === 1 && (messageLower.includes("nike") || messageLower.includes("adidas") || messageLower.includes("campaign"))) {
        const name = messageLower.includes("nike") ? "Nike Campaign" : messageLower.includes("adidas") ? "Adidas Campaign" : "New Campaign";
        const budget = messageLower.match(/\d+/) ? parseInt(messageLower.match(/\d+/)![0]) : 1000;

        response = {
          mode: "complete",
          chat: `I've set up the basic info for your ${name} with a budget of ${budget}. Moving to audience selection.`,
          intent: "SET_STEP_1",
          confidence: 1.0,
          entities: { name, budget },
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

      if (currentStep === 2 && (messageLower.includes("target") || messageLower.includes("audience") || messageLower.includes("athletes"))) {
        const audience = messageLower.includes("athletes") ? "Young athletes" : "General audience";
        response = {
          mode: "complete",
          chat: `Audience targeted towards: ${audience}. Now, let's customize the content.`,
          intent: "SET_STEP_2",
          confidence: 1.0,
          entities: { audience },
          actions: [
            {
              type: "SET_FORM",
              payload: {
                formId: "campaignForm",
                data: {
                  ...context.formData,
                  recipients: [{ id: "1", name: audience, email: "target@example.com" }],
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

      if (currentStep === 3 && (messageLower.includes("message") || messageLower.includes("content") || messageLower.includes("motivational"))) {
        const content = "Stay strong. Train harder.";
        response = {
          mode: "complete",
          chat: "Content updated with your message. We're ready for delivery settings.",
          intent: "SET_STEP_3",
          confidence: 1.0,
          entities: { content },
          actions: [
            {
              type: "SET_FORM",
              payload: {
                formId: "campaignForm",
                data: {
                  ...context.formData,
                  senderName: "Karta AI",
                  messageContent: content,
                  subject: "Message from Karta AI",
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

    // --- PLAN MODE EXAMPLE ---
    if (messageLower.includes("create") && messageLower.includes("campaign") && !context?.currentPage.includes("create")) {
      response = {
        mode: "plan",
        chat: "I'll guide you through creating a campaign in 3 main steps:",
        intent: "PLAN_CAMPAIGN",
        confidence: 1.0,
        entities: {},
        steps: [
          { id: "1", description: "Set basic info (name, budget)", status: "pending" },
          { id: "2", description: "Define your audience", status: "pending" },
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

    // --- ORIGINAL LOGIC ---
    if (messageLower.includes("create campaign") || messageLower.includes("new campaign")) {
      response = messageLower.includes("create campaign") 
        ? mockResponses["create campaign"]
        : mockResponses["new campaign"];
    } else if (messageLower.includes("campaign")) {
      response = mockResponses.campaign;
    } else if (messageLower.includes("help")) {
      response = mockResponses.help;
    } else if (
      messageLower.includes("hello") ||
      messageLower.includes("hi")
    ) {
      response = mockResponses.hello;
    } else if (messageLower.includes("features")) {
      response = mockResponses.features;
    } else if (messageLower.includes("navigate")) {
      response = mockResponses.navigate;
    } else {
      response = mockResponses.default;
    }

    return Response.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
