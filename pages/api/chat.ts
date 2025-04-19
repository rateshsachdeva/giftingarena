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
      "OpenAI-Beta": "assistants=v2"
    };

    // Step 1: Create thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers
    });
    const thread = await threadRes.json();

    if (!thread?.id) {
      console.error("❌ Failed to create thread:", thread);
      throw new Error("Failed to create thread");
    }

    // Step 2: Post user message
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: "user",
        content: message
      })
    });

    // Step 3: Run assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ assistant_id: assistantId })
    });
    const run = await runRes.json();

    if (!run?.id) throw new Error("Failed to run assistant");

    // ✅ Return early — frontend will poll
    return res.status(200).json({
      thread_id: thread.id,
      run_id: run.id
    });
  } catch (err: any) {
    console.error("❌ Error in /api/chat:", err);
    return res.status(500).json({
      text: "An error occurred while talking to the assistant.",
      error: err?.message || "Unknown error"
    });
  }
}
