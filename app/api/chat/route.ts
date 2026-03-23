import { ChatResponse } from "@/lib/types";

interface ChatRequest {
  message: string;
  messages: Array<{ role: string; content: string }>;
}

const mockResponses: Record<string, ChatResponse> = {
  help: {
    chat: "I can help you with various tasks. Try asking me about features, navigation, or any specific questions you have!",
    actions: [],
  },
  hello: {
    chat: "Hello! I'm your Karta AI Assistant. How can I help you today?",
    actions: [],
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
  navigate: {
    chat: "I can help you navigate to different pages. Where would you like to go?",
    actions: [],
  },
  default: {
    chat: "Thanks for your message! I'm a mock AI assistant. I can help you with navigation, open modals, and answer questions about Karta AI. Try asking about 'features', 'help', or 'hello'!",
    actions: [],
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

    if (messageLower.includes("help")) {
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
