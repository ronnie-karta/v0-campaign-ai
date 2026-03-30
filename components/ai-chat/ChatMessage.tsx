"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isError =
    message.content?.toLowerCase().includes("error") ||
    message.content?.toLowerCase().includes("sorry");

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 animate-fade-in`}
    >
      <div
        className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 shadow-sm transition-all ${
          isUser
            ? "bg-gray-900 text-white rounded-br-none"
            : isError
              ? "bg-gray-50 text-gray-900 rounded-bl-none border border-gray-200"
              : "bg-gray-100 text-gray-900 rounded-bl-none border border-transparent"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-medium overflow-wrap-anywhere [overflow-wrap:anywhere]">
            {message.content}
          </p>
        ) : (
          <div className="text-sm leading-relaxed break-words font-medium prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-1 prose-strong:font-bold prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-code:text-xs prose-table:text-xs prose-th:py-1 prose-th:px-2 prose-td:py-1 prose-td:px-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

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

        <div className="flex items-center gap-2 mt-1.5 opacity-40">
          <div className={`w-1 h-1 rounded-full ${isUser ? "bg-white" : "bg-gray-900"}`}></div>
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
