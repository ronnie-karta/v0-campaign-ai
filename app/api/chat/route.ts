export async function POST(request: Request): Promise<Response> {
  try {
    const { message } = await request.json();

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return Response.json(
        { chat: "AI service is not configured. Please set N8N_WEBHOOK_URL.", actions: [] },
        { status: 500 }
      );
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: message }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook returned ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();

    return Response.json({
      chat: data.chat ?? "",
      actions: data.actions ?? [],
      mode: data.mode,
      steps: data.steps,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { chat: "Sorry, I encountered an error processing your request.", actions: [] },
      { status: 500 }
    );
  }
}
