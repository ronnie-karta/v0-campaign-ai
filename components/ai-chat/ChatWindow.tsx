"use client";

import { useEffect, useRef } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export const ChatWindow = () => {
  const { messages, isLoading } = useAIAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
        <h2 className="font-semibold text-sm">Karta AI Assistant</h2>
        <p className="text-xs text-blue-100">Always here to help</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="mb-3 text-3xl">💬</div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Start a conversation with Karta AI
              </p>
              <p className="text-gray-400 text-xs mb-4">
                Ask me anything or get help with your tasks
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <p>Try:</p>
                <ul className="space-y-1">
                  <li>"Hello"</li>
                  <li>"What can you do?"</li>
                  <li>"Show features"</li>
                </ul>
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
                <div className="bg-gray-100 rounded-lg px-4 py-3 rounded-bl-none shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span className="text-xs text-gray-600 ml-1">
                      Thinking...
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
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <ChatInput />
      </div>
    </div>
  );
};
