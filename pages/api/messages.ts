import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { thread_id, run_id } = req.query;
    const apiKey = process.env.OPENAI_API_KEY;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2"
    };

    // Check run status
    const runStatusRes = await fetch(
      `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
      { headers }
    );
    const runStatus = await runStatusRes.json();

    if (runStatus.status !== "completed") {
      return res.status(202).json({ status: runStatus.status });
    }

    // Fetch completed messages
    const messagesRes = await fetch(
      `https://api.openai.com/v1/threads/${thread_id}/messages`,
      { headers }
    );
    const messagesData = await messagesRes.json();

    const assistantMessage = messagesData?.data?.reverse()?.find(
      (msg: any) => msg.role === "assistant"
    );

    const block = assistantMessage?.content?.find((b: any) =>
      b?.type === "html" || (b?.type === "text" && b?.text?.value)
    );

    const responseText =
      block?.html || block?.text?.value || "The assistant returned no response.";

    return res.status(200).json({ text: responseText });
  } catch (err: any) {
    console.error("❌ /api/messages error:", err);
    return res.status(500).json({ text: "Error fetching messages." });
  }
}

