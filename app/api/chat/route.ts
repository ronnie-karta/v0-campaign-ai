import { ChatResponse } from "@/lib/types";

interface ChatRequest {
  message: string;
  messages: Array<{ role: string; content: string }>;
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
    const { message } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const messageLower = message.toLowerCase();
    let response: ChatResponse;

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
