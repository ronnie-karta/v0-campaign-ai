"use client";

import { useEffect, useRef } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { X } from "lucide-react";
import { AI_COMMANDS } from "@/lib/ai/constants";

export const ChatWindow = () => {
  const { messages, isLoading, setOpen } = useAIAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-5 text-white flex justify-between items-center">
        <div>
          <h2 className="font-bold text-base tracking-tight">Karta Assistant</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">System Active</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-[240px]">
              <div className="mb-4 text-4xl grayscale">💬</div>
              <p className="text-gray-900 text-sm font-bold mb-2">
                System Initialized
              </p>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Awaiting your command. I can manage campaigns, status, and more.
              </p>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {AI_COMMANDS.slice(0, 5).map((text) => (
                  <div key={text} className="px-3 py-2 rounded-lg border border-gray-100 text-[10px] font-bold tracking-wider uppercase text-gray-400 hover:border-gray-300 hover:text-gray-900 transition-all cursor-default">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 rounded-bl-none">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 ml-2">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input footer */}
      <div className="p-4 bg-white border-t border-gray-100">
        <ChatInput />
      </div>
    </div>
  );
};
