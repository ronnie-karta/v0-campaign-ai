"use client";

import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isError = message.content.toLowerCase().includes("error") ||
    message.content.toLowerCase().includes("sorry");

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 animate-fade-in`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-3 shadow-sm transition-all ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : isError
              ? "bg-red-50 text-red-900 rounded-bl-none border border-red-200"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
        <span
          className={`text-xs mt-2 block opacity-70 ${
            isUser ? "text-blue-100" : isError ? "text-red-600" : "text-gray-500"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
