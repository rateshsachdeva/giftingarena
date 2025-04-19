import { Message } from "@/types";
import { FC } from "react";

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}>
      <div
        className={`flex items-center ${
          isAssistant ? "bg-neutral-200 text-neutral-900" : "bg-blue-500 text-white"
        } rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        {isAssistant ? (
          // ✅ Render assistant message as HTML
          <div
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        ) : (
          // ✅ Render user message normally
          message.content
        )}
      </div>
    </div>
  );
};
