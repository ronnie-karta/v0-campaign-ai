export async function POST(request: Request): Promise<Response> {
  try {
    const { message, sessionId, context } = await request.json();

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
      body: JSON.stringify({
        message,
        sessionId: sessionId ?? "default",
        context: context ?? {},
      }),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text().catch(() => "");
      console.error(`n8n webhook returned ${n8nResponse.status}:`, errText);
      throw new Error(`n8n webhook returned ${n8nResponse.status}`);
    }

    // Safely read and parse the response body — n8n can return 200 with empty body
    // when the workflow errors before reaching the Respond to Webhook node.
    const rawText = await n8nResponse.text();
    console.log("[n8n raw response]", rawText || "(empty)");

    if (!rawText || !rawText.trim()) {
      console.error("n8n returned empty body — check workflow execution in n8n UI");
      return Response.json({
        chat: "The AI workflow returned an empty response. Please check that the n8n workflow is active and the Anthropic credentials are valid.",
        actions: [],
      });
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("n8n response is not valid JSON:", rawText);
      return Response.json({
        chat: "The AI workflow returned an unexpected format. Please check the Respond to Webhook node in n8n.",
        actions: [],
      });
    }

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
