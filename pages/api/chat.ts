import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!assistantId || !apiKey) {
      return res.status(500).json({ text: "Missing environment variables" });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Step 1: Create thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers,
    });
    const thread = await threadRes.json();
    if (!thread?.id) throw new Error("Failed to create thread");

    // Step 2: Post user message
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: "user",
        content: message,
      }),
    });

    // Step 3: Run assistant
    const runRes = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/runs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ assistant_id: assistantId }),
      }
    );
    const run = await runRes.json();
    if (!run?.id) throw new Error("Failed to run assistant");

    // Step 4: Wait for completion
    let status = run.status;
    while (status !== "completed" && status !== "failed") {
      await new Promise((r) => setTimeout(r, 1000));
      const statusRes = await fetch(
        `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
        { method: "GET", headers }
      );
      const statusData = await statusRes.json();
      status = statusData.status;
    }

    // Step 5: Get response
    const messagesRes = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      { method: "GET", headers }
    );
    const messagesData = await messagesRes.json();

    const assistantMessage = messagesData?.data?.reverse()?.find(
      (msg: any) => msg.role === "assistant"
    );

    const block = assistantMessage?.content?.find((b: any) => {
      return (b?.type === "html" && b?.html) || (b?.type === "text" && b?.text?.value);
    });

    const responseText =
      block?.html || block?.text?.value || "The assistant returned no response.";

    return res.status(200).json({ text: responseText });
  } catch (err: any) {
    console.error("❌ Error in /api/chat:", err);
    return res.status(200).json({
      text: "An error occurred while talking to the assistant.",
      error: err?.message || "Unknown error",
    });
  }
}
