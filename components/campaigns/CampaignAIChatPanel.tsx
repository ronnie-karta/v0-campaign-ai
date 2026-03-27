"use client";

import { useEffect, useRef } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { ChatMessage } from "../ai-chat/ChatMessage";
import { ChatInput } from "../ai-chat/ChatInput";
import { AI_COMMANDS } from "@/lib/ai/constants";

export const CampaignAIChatPanel = () => {
  const { messages, isLoading } = useAIAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-5 text-white">
        <h2 className="font-bold text-base tracking-tight">Karta AI Assistant</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Active on Campaigns</p>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-[240px]">
              <div className="mb-4 text-4xl grayscale">💬</div>
              <p className="text-gray-900 text-sm font-bold mb-2">
                Assistant Initialized
              </p>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                I can help you build and manage campaigns. Try asking me to "Create a new email campaign".
              </p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
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
                      Thinking
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
