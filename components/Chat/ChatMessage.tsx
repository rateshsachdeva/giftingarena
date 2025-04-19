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
        className={`
          flex items-start 
          ${isAssistant
            ? "bg-orange-100 text-[#5c1f00]"
            : "bg-indigo-600 text-white"}
          rounded-2xl px-4 py-3 max-w-[80%] shadow-md text-base leading-relaxed
        `}
        style={{ overflowWrap: "anywhere" }}
      >
        {isAssistant ? (
          <div
            dangerouslySetInnerHTML={{ __html: message.content }}
            className="prose prose-sm max-w-none"
          />
        ) : (
          <span>{message.content}</span>
        )}
      </div>
    </div>
  );
};
