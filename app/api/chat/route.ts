import { ChatResponse } from "@/lib/types";

interface ChatRequest {
  message: string;
  messages: Array<{ role: string; content: string }>;
}

const mockResponses: Record<string, ChatResponse> = {
  help: {
    chat: "I can help you with various tasks. Try asking me about features, navigation, campaigns, or any specific questions you have!",
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modalId: "help-modal",
          data: {
            title: "Help",
            content: "I can help you with features, navigation, and campaigns.",
          },
        },
      },
    ],
  },
  hello: {
    chat: "Hello! I'm your Karta AI Assistant. How can I help you today?",
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modalId: "quick-actions",
          data: {
            title: "Quick Actions",
            content: "Do you want to create a campaign or view existing ones?",
          },
        },
      },
    ],
  },
  features: {
    chat: "Karta AI offers AI-powered chat assistance, smart actions, and modal interactions. You can ask me anything and I'll help guide you through the app!",
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modalId: "features-modal",
          data: {
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
    chat: "I'll help you create a new email or SMS campaign. Let me open the campaign creation wizard for you.",
    actions: [
      {
        type: "OPEN_CAMPAIGN",
        payload: {
          data: {},
        },
      },
    ],
  },
  "create campaign": {
    chat: "Great! Let's create a new campaign. I'm opening the campaign builder for you. You can set up your email or SMS campaign in just 5 simple steps.",
    actions: [
      {
        type: "OPEN_CAMPAIGN",
        payload: {
          data: {},
        },
      },
    ],
  },
  "new campaign": {
    chat: "Perfect! I'm launching the campaign creation wizard. You'll be able to configure your message, recipients, delivery schedule, and payment in a guided workflow.",
    actions: [
      {
        type: "OPEN_CAMPAIGN",
        payload: {
          data: {},
        },
      },
    ],
  },
  navigate: {
    chat: "I can help you navigate to different pages. Where would you like to go?",
    actions: [
      {
        type: "NAVIGATE",
        payload: {
          route: "/campaigns",
        },
      },
    ],
  },
  default: {
    chat: "Do you want to create a campaign or view existing ones?",
    actions: [
      {
        type: "OPEN_MODAL",
        payload: {
          modalId: "quick-actions",
          data: {},
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
