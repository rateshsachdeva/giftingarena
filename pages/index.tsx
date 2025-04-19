import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Step 1: Start assistant run
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.content })
      });

      const { thread_id, run_id } = await response.json();

      if (!thread_id || !run_id) {
        throw new Error("Missing thread_id or run_id from response.");
      }

      // Step 2: Poll until assistant finishes
      let completed = false;
      let assistantReply = "";

      while (!completed) {
        const res = await fetch(`/api/messages?thread_id=${thread_id}&run_id=${run_id}`);
        const data = await res.json();

        if (res.status === 202) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait and try again
        } else {
          assistantReply = data.text;
          completed = true;
        }
      }

      // Step 3: Add assistant reply to messages
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Oops! Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Gifting Arena's AI Assistant 🎁. I can help you find the perfect gift based on personality, occasion, or budget. Just ask!`
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleReset(); // Show welcome message on first load
  }, []);

  return (
    <>
      <Head>
        <title>Gifting Arena AI Assistant</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI Assistants API using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
