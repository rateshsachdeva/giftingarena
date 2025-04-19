import { Message } from "@/types";
import { FC } from "react";

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-4`}>
      {/* Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 mr-2">
          <div className="h-11 w-11 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            🤖
          </div>
        </div>
      )}

      {/* Message Bubble */}
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

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex-shrink-0 ml-2">
          <div className="h-11 w-11 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            🧑
          </div>
        </div>
      )}
    </div>
  );
};
