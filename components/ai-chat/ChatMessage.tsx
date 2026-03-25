"use client";

import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isError = message.content?.toLowerCase().includes("error") ||
    message.content?.toLowerCase().includes("sorry");

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm transition-all ${
          isUser
            ? "bg-gray-900 text-white rounded-br-none"
            : isError
              ? "bg-gray-50 text-gray-900 rounded-bl-none border border-gray-200"
              : "bg-gray-100 text-gray-900 rounded-bl-none border border-transparent"
        }`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-medium">
          {message.content}
        </p>

        {message.mode === "plan" && message.steps && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-3">
            {message.steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    step.status === "completed"
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : step.status === "current"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-xs font-bold tracking-tight ${
                    step.status === "completed"
                      ? "text-gray-500 line-through decoration-gray-400"
                      : step.status === "current"
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  {step.description}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 opacity-40">
          <div className={`w-1 h-1 rounded-full ${isUser ? 'bg-white' : 'bg-gray-900'}`}></div>
          <span className="text-[10px] font-bold tracking-widest uppercase">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
