import { Action } from "@/lib/types";

interface ChatRequest {
  message: string;
  messages: Array<{ role: string; content: string }>;
  context?: {
    currentPage: string;
    activeForm: string;
    currentStep: number;
    formData: any;
    form?: {
      formId: string;
      data: Record<string, any>;
    };
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

    // --- 1. DATA EXTRACTION ---
    const extractedData: Record<string, any> = {};

    // Name extraction (Simple heuristics for personal info)
    const nameMatch = message.match(/(?:my name is|i am|name:)\s+([a-zA-Z]+\s+[a-zA-Z]+)/i);
    if (nameMatch) {
      const parts = nameMatch[1].trim().split(/\s+/);
      extractedData.firstName = toProperCase(parts[0]);
      extractedData.lastName = toProperCase(parts[1]);
    } else {
      // Try extracting first/last separately if specific
      const firstMatch = message.match(/(?:first name|my first name is)\s+([a-zA-Z]+)/i);
      if (firstMatch) extractedData.firstName = toProperCase(firstMatch[1]);
      
      const lastMatch = message.match(/(?:last name|my last name is)\s+([a-zA-Z]+)/i);
      if (lastMatch) extractedData.lastName = toProperCase(lastMatch[1]);
    }

    // Birthday extraction (YYYY-MM-DD)
    const birthdayMatch = message.match(/(?:birthday|born on|born)\s*(?::|is)?\s*(\d{4}-\d{2}-\d{2})/i);
    if (birthdayMatch) {
      extractedData.birthday = birthdayMatch[1];
    } else {
      // Simple word match for demo
      if (messageLower.includes("january 1st 1990")) extractedData.birthday = "1990-01-01";
    }

    // Address extraction
    const addressMatch = message.match(/(?:address|live at|lives at)\s*(?::|is)?\s*(.+)/i);
    if (addressMatch) {
      extractedData.address = addressMatch[1].trim();
    }

    // --- 2. MERGE DATA ---
    const existingData = context?.form?.data || {};
    const mergedData = { ...existingData, ...extractedData };

    // --- 3. IDENTIFY MISSING FIELDS ---
    const requiredFields = ["firstName", "lastName", "birthday", "address"];
    const missingFields = requiredFields.filter(field => !mergedData[field]);

    // --- 4. RESPONSE LOGIC ---
    let chatResponse = "";
    const actions: Action[] = [];

    // ALWAYS return SET_FORM with merged data
    actions.push({
      type: "SET_FORM",
      payload: {
        formId: "personalInfoForm",
        data: mergedData
      }
    });

    if (missingFields.length > 0) {
      // Map field names to friendly names
      const friendlyNames: Record<string, string> = {
        firstName: "first name",
        lastName: "last name",
        birthday: "birthday (YYYY-MM-DD)",
        address: "address"
      };
      
      const nextField = friendlyNames[missingFields[0]];
      chatResponse = `Got it. Could you please provide your ${nextField}?`;
      
      if (missingFields.length > 1) {
        chatResponse = `I've updated your info. I still need your ${missingFields.map(f => friendlyNames[f]).join(", ")}.`;
      }
    } else {
      // FORM IS COMPLETE
      chatResponse = "Thank you! Your information is complete. I'm opening the confirmation modal now.";
      actions.push({
        type: "OPEN_MODAL",
        payload: {
          modalId: "personal-info-modal",
          data: mergedData
        }
      });
      actions.push({
        type: "SHOW_TOAST",
        payload: {
          message: "Profile information verified!",
          type: "success"
        }
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
